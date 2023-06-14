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
    string public constant PUBLIC_METADATA_URI =
        "https://ipfs.io/ipfs/QmaNfrXqMu8j2UdNDj881r3VnaXoAGrpDbJoDRJRXwfdaU";

    struct Collection {
        string uri;
        uint256 id;
        address owner;
    }

    NFTMarketplace private _marketplace;

    mapping(uint256 => Collection) private _collections;
    mapping(uint256 => uint256[]) private _nftCollections; // Mapping from collection ID to list of token IDs
    mapping(uint256 => uint256) private _nftToCollection; // Mapping from token ID to collection ID
    mapping(uint256 => uint256) private _tokenPrices; // Mapping from token ID to its price

    mapping(address => uint256) public collectionsCreated;
    mapping(address => uint256) public lastCollectionTimestamp;

    event CollectionCreated(uint256 id, string uri);
    event TokenMinted(uint256 tokenId, uint256 collectionId);
    event PriceSet(uint256 tokenId, uint256 price);

    constructor() ERC721("ERC721Collections", "STR") {
        createCollection(PUBLIC_METADATA_URI);
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
        uint256 collectionId
    ) public view returns (uint256[] memory) {
        return _nftCollections[collectionId];
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
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
}
