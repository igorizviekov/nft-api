// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

interface IERC721Collections is IERC721 {
    function getNFTsInCollection(
        uint256 collectionId,
        uint256 startIndex,
        uint256 pageSize
    ) external view returns (uint256[] memory);

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);

    function mintToCollection(
        uint256 collectionId,
        address to,
        string memory tokenURI,
        uint256 price
    ) external returns (uint256 tokenId, address collectionOwner);
}

/**
 * @title NFTMarketplace
 * @dev A contract for buying and selling NFTs, with support for royalties.
 * Inherits from OpenZeppelin's Ownable, ReentrancyGuard, and PaymentSplitter contracts.
 */
contract NFTMarketplace is Ownable, ReentrancyGuard, PaymentSplitter {
    using Counters for Counters.Counter;

    /**
     * @dev The percentage of the sale price that will be kept as royalties
     */
    uint256 private _royalties;
    uint256 public constant MIN_PRICE = 0.001 ether;

    address private _nftContractAddress;

    /**
     * @dev IERC721Collections - an interface to interact with the NFT Collections contract.
     */
    IERC721Collections private _nftContract;

    Counters.Counter private _totalListings;

    mapping(bytes32 => Listing) public listings;
    bytes32[] public listingsKeys;
    // maximum number of listings per page
    uint256 constant PAGE_SIZE = 100;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        address collection;
    }

    event NFTListed(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller,
        address indexed collection
    );

    event NFTDelisted(uint256 indexed tokenId, address indexed collection);
    event NFTSold(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer,
        address collection
    );

    constructor(
        address nftContractAddress,
        address[] memory payees,
        uint256[] memory shares,
        uint256 royalties
    ) PaymentSplitter(payees, shares) {
        require(payees.length > 0, "At least one payee is required");
        require(
            payees.length == shares.length,
            "Payees and shares length must match"
        );
        _nftContract = IERC721Collections(nftContractAddress);
        _nftContractAddress = nftContractAddress;
        _royalties = royalties;
    }

    function getKeyForToken(
        address collection,
        uint256 tokenId
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(collection, tokenId));
    }

    function isTokenListed(
        address collection,
        uint256 tokenId
    ) public view returns (bool) {
        bytes32 key = getKeyForToken(collection, tokenId);
        return listings[key].seller != address(0);
    }

    /**
     * @dev get all NFT listed for sale
     */
    function getAllListings(
        uint256 page
    ) public view returns (Listing[] memory) {
        require(page > 0, "Page number should be greater than 0");
        uint256 totalListings = _totalListings.current();
        uint256 start = (page - 1) * PAGE_SIZE;
        uint256 end = start + PAGE_SIZE > totalListings
            ? totalListings
            : start + PAGE_SIZE;

        if (end <= start) {
            return new Listing[](0);
        }

        Listing[] memory pageListings = new Listing[](end - start);

        uint256 counter = 0;
        for (uint256 i = start; i < end; i++) {
            bytes32 key = listingsKeys[i];
            if (listings[key].seller != address(0)) {
                pageListings[counter] = listings[key];
                counter++;
            }
        }

        Listing[] memory activeListings = new Listing[](counter);
        for (uint256 i = 0; i < counter; i++) {
            activeListings[i] = pageListings[i];
        }
        return activeListings;
    }

    /**
     * @dev Gets all listings of a specific seller.
     * @param seller The address of the seller.
     * @return A dynamic array containing all listings of the seller.
     */
    function getListingsBySeller(
        address seller,
        uint256 page,
        uint256 pageSize
    ) public view returns (Listing[] memory) {
        uint256 totalListings = listingsKeys.length;
        uint256 start = page * pageSize;
        uint256 end = Math.min(start + pageSize, totalListings);

        if (end <= start) {
            return new Listing[](0);
        }

        Listing[] memory sellerListings = new Listing[](end - start);
        uint256 count = 0;

        for (uint256 i = start; i < end; i++) {
            Listing storage listing = listings[listingsKeys[i]];
            if (listing.seller == seller) {
                sellerListings[count] = listing;
                count++;
            }
        }

        return sellerListings;
    }

    /**
     * @dev Gets all listings of a specific NFT contract.
     * @param collection The address of the NFT contract.
     * @return A dynamic array containing all listings of the NFT contract.
     */
    function getListingsByNFTContract(
        address collection,
        uint256 page,
        uint256 pageSize
    ) public view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listings[listingsKeys[i]].collection == collection) {
                count++;
            }
        }

        uint256 start = page * pageSize;
        uint256 end = Math.min(start + pageSize, count);
        if (end <= start) {
            return new Listing[](0);
        }
        Listing[] memory contractListings = new Listing[](end - start);

        uint256 index = 0;
        for (
            uint256 i = 0;
            i < listingsKeys.length && index < end - start;
            i++
        ) {
            if (listings[listingsKeys[i]].collection == collection) {
                if (index >= start) {
                    contractListings[index - start] = listings[listingsKeys[i]];
                }
                index++;
            }
        }

        return contractListings;
    }

    /**
     * @dev Gets the listing associated with a specific token ID and contract address.
     * @param tokenId The token ID.
     * @param collection The address of the NFT contract.
     * @return The listing associated with the specific token ID and contract address.
     */
    function getListingByTokenIdAndAddress(
        uint256 tokenId,
        address collection
    ) public view returns (Listing memory) {
        bytes32 key = getKeyForToken(collection, tokenId);
        require(
            listings[key].seller != address(0),
            "No listing found for this tokenId and collection"
        );
        return listings[key];
    }

    /**
     * @dev get all NFT listed for sale inside a Collection
     */
    function getListedTokensInCollection(
        uint256 collectionId,
        uint256 startIndex,
        uint256 pageSize,
        address collection
    ) public view returns (uint256[] memory) {
        uint256[] memory listedNFTs = new uint256[](pageSize);
        uint256 count = 0;
        uint256[] memory collectionTokens = _nftContract.getNFTsInCollection(
            collectionId,
            startIndex,
            pageSize
        );

        if (collectionTokens.length == 0) {
            return new uint256[](0);
        }

        for (uint256 i = 0; i < collectionTokens.length; i++) {
            uint256 tokenId = collectionTokens[i];
            bytes32 key = getKeyForToken(collection, tokenId);
            if (listings[key].seller != address(0)) {
                listedNFTs[count] = tokenId;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = listedNFTs[i];
        }
        return result;
    }

    /**
     * @dev Lists an NFT for sale.
     * Requirements:
     * - The caller must be the owner of the NFT.
     * - The marketplace contract must be approved to manage all NFTs of the owner.
     * - The NFT must not be already listed for sale.
     * - The price must be greater than 0.
     */
    function listNFT(
        uint256 tokenId,
        uint256 price,
        address collection
    ) public nonReentrant {
        IERC721 nftContract = IERC721(collection);
        IERC165 checker = IERC165(collection);
        require(
            checker.supportsInterface(type(IERC721).interfaceId),
            "The NFT contract does not support the ERC721 interface"
        );
        require(!isTokenListed(collection, tokenId), "Token is already listed");
        require(price >= MIN_PRICE, "Price must be greater than MIN_PRICE");
        require(
            nftContract.ownerOf(tokenId) == msg.sender ||
                (msg.sender == _nftContractAddress &&
                    collection == _nftContractAddress),
            "You don't own this NFT"
        );
        //   require(
        //             checker.supportsInterface(type(IERC2981).interfaceId),
        //             "The NFT contract does not support the IERC2981 interface"
        //         );
        bytes32 key = getKeyForToken(collection, tokenId);
        listings[key] = Listing({
            tokenId: tokenId,
            price: price,
            seller: nftContract.ownerOf(tokenId),
            collection: collection
        });
        nftContract.transferFrom(
            nftContract.ownerOf(tokenId),
            address(this),
            tokenId
        );
        _totalListings.increment();
        listingsKeys.push(key);
        emit NFTListed(tokenId, price, msg.sender, collection);
    }

    function delistNFT(
        address collection,
        uint256 tokenId
    ) public nonReentrant {
        bytes32 key = getKeyForToken(collection, tokenId);
        Listing storage listing = listings[key];
        require(listing.seller == msg.sender, "You don't own this NFT");

        IERC721 nftContract = IERC721(listing.collection);
        delete listings[key];
        // nftContract.transferFrom(address(this), msg.sender, tokenId);
        _totalListings.decrement();
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listingsKeys[i] == key) {
                listingsKeys[i] = listingsKeys[listingsKeys.length - 1];
                listingsKeys.pop();
                break;
            }
        }
        emit NFTDelisted(tokenId, collection);
    }

    function buyNFT(
        address collection,
        uint256 tokenId
    ) public payable nonReentrant {
        bytes32 key = getKeyForToken(collection, tokenId);
        Listing storage listing = listings[key];
        require(
            msg.value == listing.price,
            "Sent value does not match the NFT price"
        );
        require(
            listing.price >= MIN_PRICE,
            "Listing price must be greater than MIN_PRICE"
        );

        require(listing.seller != msg.sender, "Owner cannot buy their own NFT");
        IERC165 checker = IERC165(collection);
        require(
            checker.supportsInterface(type(IERC721).interfaceId),
            "The NFT contract does not support the ERC721 interface"
        );
        require(
            checker.supportsInterface(type(IERC2981).interfaceId),
            "The NFT contract does not support the ERC2981 interface"
        );
        IERC2981 nftContractRoyalties = IERC2981(collection);
        IERC721 nftContract = IERC721(collection);
        (address receiver, uint256 royaltyAmount) = nftContractRoyalties
            .royaltyInfo(listing.tokenId, listing.price);

        uint256 marketplaceRoyaltiesAmount = (listing.price * _royalties) / 100;

        require(
            listing.price > (marketplaceRoyaltiesAmount + royaltyAmount),
            "Price should be higher than total royalties"
        );

        uint256 sellerAmount = listing.price -
            (royaltyAmount + marketplaceRoyaltiesAmount);

        (bool success, ) = payable(listing.seller).call{value: sellerAmount}(
            ""
        );
        require(success, "Transfer to NFT owner failed.");
        (bool royaltySuccess, ) = payable(receiver).call{value: royaltyAmount}(
            ""
        );
        require(royaltySuccess, "Transfer of royalty to the receiver failed.");

        delete listings[key];
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        _totalListings.decrement();
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listingsKeys[i] == key) {
                listingsKeys[i] = listingsKeys[listingsKeys.length - 1];
                listingsKeys.pop();
                break;
            }
        }
        emit NFTSold(
            tokenId,
            listing.price,
            listing.seller,
            msg.sender,
            listing.collection
        );
    }

    function buyFromCollection(
        uint256 collectionId,
        string memory tokenURI
    ) public payable nonReentrant {
        uint256 marketplaceRoyaltiesAmount = (msg.value * _royalties) / 100;
        require(
            msg.value > marketplaceRoyaltiesAmount,
            "Price should be higher than total royalties"
        );
        (uint256 tokenId, address collectionOwner) = _nftContract
            .mintToCollection(collectionId, msg.sender, tokenURI, msg.value);

        uint256 sellerAmount = msg.value - marketplaceRoyaltiesAmount;
        (bool success, ) = payable(collectionOwner).call{value: sellerAmount}(
            ""
        );

        require(success, "Transfer to Collection owner failed.");
        emit NFTSold(
            tokenId,
            msg.value,
            collectionOwner,
            msg.sender,
            _nftContractAddress
        );
    }
}
