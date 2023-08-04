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
        uint256 _tokenId,
        uint256 _salePrice
    ) external view returns (address receiver, uint256 royaltyAmount);
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
    uint256 public constant MIN_PRICE = 0.01 ether;

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
        address nftAddress;
    }

    event NFTListed(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller,
        address indexed nftAddress
    );

    event NFTDelisted(uint256 indexed tokenId, address indexed nftAddress);
    event NFTSold(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer,
        address nftAddress
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
        _royalties = royalties;
    }

    function getKeyForToken(
        address nftAddress,
        uint256 tokenId
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(nftAddress, tokenId));
    }

    function isTokenListed(
        address nftAddress,
        uint256 tokenId
    ) public view returns (bool) {
        bytes32 key = getKeyForToken(nftAddress, tokenId);
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
        address seller
    ) public view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listings[listingsKeys[i]].seller == seller) {
                count++;
            }
        }
        Listing[] memory sellerListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listings[listingsKeys[i]].seller == seller) {
                sellerListings[index] = listings[listingsKeys[i]];
                index++;
            }
        }
        return sellerListings;
    }

    /**
     * @dev Gets all listings of a specific NFT contract.
     * @param nftAddress The address of the NFT contract.
     * @return A dynamic array containing all listings of the NFT contract.
     */
    function getListingsByNFTContract(
        address nftAddress
    ) public view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listings[listingsKeys[i]].nftAddress == nftAddress) {
                count++;
            }
        }
        Listing[] memory contractListings = new Listing[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listings[listingsKeys[i]].nftAddress == nftAddress) {
                contractListings[index] = listings[listingsKeys[i]];
                index++;
            }
        }

        return contractListings;
    }

    /**
     * @dev Gets the listing associated with a specific token ID and contract address.
     * @param tokenId The token ID.
     * @param nftAddress The address of the NFT contract.
     * @return The listing associated with the specific token ID and contract address.
     */
    function getListingByTokenIdAndAddress(
        uint256 tokenId,
        address nftAddress
    ) public view returns (Listing memory) {
        bytes32 key = getKeyForToken(nftAddress, tokenId);
        require(
            listings[key].seller != address(0),
            "No listing found for this tokenId and nftAddress"
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
        address nftAddress
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
            bytes32 key = getKeyForToken(nftAddress, tokenId);
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
        address nftAddress
    ) public nonReentrant {
        IERC721 nftContract = IERC721(nftAddress);
        IERC165 checker = IERC165(nftAddress);
        require(
            checker.supportsInterface(type(IERC721).interfaceId),
            "The NFT contract does not support the ERC721 interface"
        );
        require(
            checker.supportsInterface(type(IERC2981).interfaceId),
            "The NFT contract does not support the ERC2981 interface"
        );
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "You don't own this NFT"
        );
        require(price >= MIN_PRICE, "Price must be greater than MIN_PRICE");
        require(!isTokenListed(nftAddress, tokenId), "Token is already listed");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved to transfer this NFT"
        );
        bytes32 key = getKeyForToken(nftAddress, tokenId);
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        listings[key] = Listing({
            tokenId: tokenId,
            price: price,
            seller: msg.sender,
            nftAddress: nftAddress
        });
        _totalListings.increment();
        listingsKeys.push(key);
        emit NFTListed(tokenId, price, msg.sender, nftAddress);
    }

    function delistNFT(
        address nftAddress,
        uint256 tokenId
    ) public nonReentrant {
        bytes32 key = getKeyForToken(nftAddress, tokenId);
        Listing storage listing = listings[key];
        require(listing.seller == msg.sender, "You don't own this NFT");

        IERC721 nftContract = IERC721(listing.nftAddress);
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
        emit NFTDelisted(tokenId, nftAddress);
    }

    function buyNFT(
        address nftAddress,
        uint256 tokenId
    ) public payable nonReentrant {
        bytes32 key = getKeyForToken(nftAddress, tokenId);
        Listing storage listing = listings[key];
        require(
            msg.value == listing.price,
            "Sent value does not match the NFT price"
        );
        require(listing.seller != msg.sender, "Owner cannot buy their own NFT");
        IERC165 checker = IERC165(nftAddress);
        require(
            checker.supportsInterface(type(IERC721).interfaceId),
            "The NFT contract does not support the ERC721 interface"
        );
        require(
            checker.supportsInterface(type(IERC2981).interfaceId),
            "The NFT contract does not support the ERC2981 interface"
        );
        IERC2981 nftContractRoyalties = IERC2981(nftAddress);
        IERC721 nftContract = IERC721(nftAddress);
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
            listing.nftAddress
        );
    }
}
