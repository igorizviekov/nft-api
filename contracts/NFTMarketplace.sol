// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

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

contract NFTMarketplace is Ownable, ReentrancyGuard, PaymentSplitter, Pausable {
    using Counters for Counters.Counter;
    uint256 private _royalties;
    uint256 public constant MIN_PRICE = 0.001 ether;
    address private _nftContractAddress;
    IERC721Collections private _nftContract;
    Counters.Counter private _totalListings;
    mapping(bytes32 => Listing) public listings;
    bytes32[] public listingsKeys;
    uint256 constant PAGE_SIZE = 100;
    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        address collection;
    }

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
        require(royalties <= 10, "Maximum % of royalties exeedded");
        _nftContract = IERC721Collections(nftContractAddress);
        _nftContractAddress = nftContractAddress;
        _royalties = royalties;
    }

    function _performPagination(
        uint256 totalItems,
        uint256 page
    ) internal pure returns (uint256, uint256) {
        require(page > 0, "Page number should be greater than 0");
        uint256 start = (page - 1) * PAGE_SIZE;
        uint256 end = start + PAGE_SIZE > totalItems
            ? totalItems
            : start + PAGE_SIZE;
        require(end > start, "Invalid pagination range");
        return (start, end);
    }

    function _checkCollectionContract(address collection) internal {
        IERC165 checker = IERC165(collection);
        require(
            checker.supportsInterface(type(IERC721).interfaceId),
            "The NFT contract does not support the ERC721 interface"
        );
        require(
            checker.supportsInterface(type(IERC2981).interfaceId),
            "The NFT contract does not support the ERC2981 interface"
        );
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

    function getAllListings(
        uint256 page
    ) public view returns (Listing[] memory) {
        (uint256 start, uint256 end) = _performPagination(
            _totalListings.current(),
            page
        );
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

    function getListingsBySeller(
        address seller,
        uint256 page
    ) public view returns (Listing[] memory) {
        (uint256 start, uint256 end) = _performPagination(
            listingsKeys.length,
            page
        );
        Listing[] memory sellerListings = new Listing[](end - start);
        uint256 count = 0;
        for (uint256 i = start; i < end; i++) {
            Listing storage listing = listings[listingsKeys[i]];
            if (listing.seller == seller) {
                sellerListings[count] = listing;
                count++;
            }
        }
        Listing[] memory filteredListings = new Listing[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredListings[i] = sellerListings[i];
        }
        return filteredListings;
    }

    function getListingsByNFTContract(
        address collection,
        uint256 page
    ) public view returns (Listing[] memory) {
        (uint256 start, uint256 end) = _performPagination(
            listingsKeys.length,
            page
        );
        Listing[] memory contractListings = new Listing[](end - start);
        uint256 count = 0;
        for (uint256 i = start; i < end; i++) {
            Listing storage listing = listings[listingsKeys[i]];

            if (listing.collection == collection) {
                contractListings[count] = listings[listingsKeys[i]];
                count++;
            }
        }
        Listing[] memory filteredListings = new Listing[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredListings[i] = contractListings[i];
        }
        return filteredListings;
    }

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

    function listNFT(
        uint256 tokenId,
        uint256 price,
        address collection
    ) public nonReentrant whenNotPaused {
        IERC721 nftContract = IERC721(collection);
        _checkCollectionContract(collection);
        require(!isTokenListed(collection, tokenId), "Token is already listed");
        require(price >= MIN_PRICE, "Price must be greater than MIN_PRICE");
        require(
            nftContract.ownerOf(tokenId) == msg.sender ||
                (msg.sender == _nftContractAddress &&
                    collection == _nftContractAddress),
            "You don't own this NFT"
        );
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
    }

    function delistNFT(
        address collection,
        uint256 tokenId
    ) public nonReentrant whenNotPaused {
        bytes32 key = getKeyForToken(collection, tokenId);
        Listing storage listing = listings[key];
        require(listing.seller == msg.sender, "You don't own this NFT");
        IERC721 nftContract = IERC721(listing.collection);
        nftContract.transferFrom(address(this), listing.seller, tokenId);
        delete listings[key];
        _totalListings.decrement();
        for (uint256 i = 0; i < listingsKeys.length; i++) {
            if (listingsKeys[i] == key) {
                listingsKeys[i] = listingsKeys[listingsKeys.length - 1];
                listingsKeys.pop();
                break;
            }
        }
    }

    function buyNFT(
        address collection,
        uint256 tokenId
    ) public payable nonReentrant whenNotPaused {
        bytes32 key = getKeyForToken(collection, tokenId);
        Listing storage listing = listings[key];
        require(
            msg.value == listing.price,
            "Sent value does not match the NFT price"
        );
        require(listing.seller != msg.sender, "Owner cannot buy their own NFT");
        _checkCollectionContract(collection);
        IERC2981 nftContractRoyalties = IERC2981(collection);
        IERC721 nftContract = IERC721(collection);
        (address receiver, uint256 royaltyAmount) = nftContractRoyalties
            .royaltyInfo(listing.tokenId, listing.price);
        uint256 marketplaceRoyaltiesAmount = (listing.price * _royalties) / 100;
        uint256 totalRoyaltiesAmount = marketplaceRoyaltiesAmount +
            royaltyAmount;
        require(
            listing.price >= totalRoyaltiesAmount,
            "Price should cover total royalties"
        );
        uint256 sellerAmount = listing.price - totalRoyaltiesAmount;
        (bool success, ) = payable(listing.seller).call{value: sellerAmount}(
            ""
        );
        require(success, "Transfer to NFT seller failed.");
        (bool royaltySuccess, ) = payable(receiver).call{value: royaltyAmount}(
            ""
        );
        require(royaltySuccess, "Transfer of royalty to the receiver failed.");
        nftContract.transferFrom(address(this), msg.sender, listing.tokenId);
        delete listings[key];
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
    ) public payable nonReentrant whenNotPaused {
        uint256 marketplaceRoyaltiesAmount = (msg.value * _royalties) / 100;
        require(
            msg.value > marketplaceRoyaltiesAmount,
            "Price should be higher than total royalties"
        );
        (uint256 tokenId, address collectionOwner) = _nftContract
            .mintToCollection(collectionId, msg.sender, tokenURI, msg.value);
        uint256 sellerAmount = msg.value - marketplaceRoyaltiesAmount;
        (bool sellerSuccess, ) = payable(collectionOwner).call{
            value: sellerAmount
        }("");
        require(sellerSuccess, "Transfer to NFT owner failed.");
        emit NFTSold(
            tokenId,
            msg.value,
            collectionOwner,
            msg.sender,
            _nftContractAddress
        );
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
