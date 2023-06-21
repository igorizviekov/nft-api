// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./NFTMarketplace.sol";

/**
 * @title ERC721Collections
 * @dev A contract for creating and managing NFT collections. Inherits from OpenZeppelin's ERC721URIStorage and Ownable contracts.
 */
contract ERC721Collections is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    Counters.Counter private _collectionIdTracker;

    uint256 constant MAX_COLLECTIONS_PER_ADDRESS = 999;
    uint256 constant TIME_BETWEEN_COLLECTIONS = 1 minutes;
    uint256 public constant MIN_PRICE = 0.01 ether;
    uint256 public constant MAX_PRICE = 10000 ether;

    struct Collection {
        string uri;
        uint256 id;
        address owner;
    }

    NFTMarketplace private _marketplace;

    modifier onlyMarketplace() {
        require(
            msg.sender == address(_marketplace),
            "Caller is not the marketplace"
        );
        _;
    }

    mapping(uint256 => Collection) private _collections;
    mapping(uint256 => uint256[]) private _nftCollections; // Mapping from collection ID to list of token IDs
    mapping(uint256 => uint256) private _nftToCollection; // Mapping from token ID to collection ID
    mapping(uint256 => uint256) private _tokenPrices; // Mapping from token ID to its price

    mapping(address => uint256) public collectionsCreated;
    mapping(address => uint256) public lastCollectionTimestamp;

    event CollectionCreated(uint256 id, string uri);
    event TokenMinted(uint256 tokenId, uint256 collectionId);
    event PriceSet(uint256 tokenId, uint256 price);

    constructor(
        string memory publicCollectionURI
    ) ERC721("ERC721Collections", "STR") {
        createCollection(publicCollectionURI);
        _tokenIdTracker.increment();
    }

    function setMarketplace(
        address payable marketplaceAddress
    ) public onlyOwner {
        require(
            address(_marketplace) == address(0),
            "Marketplace address has already been set"
        );
        require(marketplaceAddress != address(0), "Invalid address");
        _marketplace = NFTMarketplace(marketplaceAddress);
    }

    function getCollection(uint256 id) public view returns (Collection memory) {
        return _collections[id];
    }

    function getCollectionOfToken(
        uint256 tokenId
    ) public view returns (Collection memory) {
        require(
            _nftToCollection[tokenId] != 0,
            "Token does not belong to any collection"
        );
        uint256 collectionId = _nftToCollection[tokenId];
        return _collections[collectionId];
    }

    function getNFTsInCollection(
        uint256 collectionId,
        uint256 startIndex,
        uint256 pageSize
    ) public view returns (uint256[] memory) {
        uint256[] storage allTokens = _nftCollections[collectionId];
        require(allTokens.length > 0, "Array is empty");
        require(startIndex < allTokens.length, "Invalid start index");
        if (pageSize > 100) {
            pageSize = 100;
        }
        uint256 endIndex = startIndex + pageSize;
        if (endIndex > allTokens.length) {
            endIndex = allTokens.length;
        }

        uint256[] memory tokens = new uint256[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            tokens[i - startIndex] = allTokens[i];
        }

        return tokens;
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }

    function getCollectionOwner(
        uint256 collectionId
    ) external view returns (address) {
        return _collections[collectionId].owner;
    }

    function setPrice(uint256 tokenId, uint256 price) public returns (uint256) {
        require(price >= MIN_PRICE, "Price must be at least MIN_PRICE");
        require(price <= MAX_PRICE, "Price must not exceed MAX_PRICE");
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        require(
            !_marketplace.isTokenListed(tokenId),
            "Token is currently listed for sale"
        );
        _tokenPrices[tokenId] = price;

        emit PriceSet(tokenId, price);

        return _tokenPrices[tokenId];
    }

    function createCollection(string memory uri) public returns (uint256) {
        require(
            collectionsCreated[msg.sender] < MAX_COLLECTIONS_PER_ADDRESS,
            "Max collections reached"
        );
        require(
            lastCollectionTimestamp[msg.sender] + TIME_BETWEEN_COLLECTIONS <=
                block.timestamp,
            "Must wait before creating another collection"
        );

        _collectionIdTracker.increment();

        _collections[_collectionIdTracker.current()] = Collection({
            uri: uri,
            id: _collectionIdTracker.current(),
            owner: msg.sender
        });

        collectionsCreated[msg.sender]++;
        lastCollectionTimestamp[msg.sender] = block.timestamp;

        emit CollectionCreated(_collectionIdTracker.current(), uri);

        return _collectionIdTracker.current();
    }

    function mint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price
    ) public returns (uint256) {
        require(price >= MIN_PRICE, "Price must be at least MIN_PRICE");
        require(price <= MAX_PRICE, "Price must not exceed MAX_PRICE");
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            collectionId == 1 || _collections[collectionId].owner == msg.sender,
            "Not the owner of the collection"
        );
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        _tokenPrices[newTokenId] = price;

        emit TokenMinted(newTokenId, collectionId);

        return newTokenId;
    }

    function lazyMint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price,
        address to
    ) public onlyMarketplace returns (uint256) {
        require(price >= MIN_PRICE, "Price must be at least MIN_PRICE");
        require(price <= MAX_PRICE, "Price must not exceed MAX_PRICE");
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );

        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        _tokenPrices[newTokenId] = price;

        emit TokenMinted(newTokenId, collectionId);
        return newTokenId;
    }
}
