// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "./NFTMarketplace.sol";

/**
 * @title ERC721Collections
 * @dev A contract for creating and managing NFT collections. Inherits from OpenZeppelin's ERC721URIStorage and Ownable contracts.
 */
contract ERC721Collections is ERC721URIStorage, IERC2981, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    Counters.Counter private _collectionIdTracker;

    uint256 constant MAX_COLLECTIONS_PER_ADDRESS = 999;
    uint256 constant TIME_BETWEEN_COLLECTIONS = 1 minutes;
    uint256 public constant MIN_PRICE = 0.01 ether;

    mapping(uint256 => address) private _creators;
    mapping(uint256 => uint256) private _creatorRoyalties;

    struct Collection {
        string uri;
        uint256 id;
        address owner;
        uint256 mintDate;
        uint256 mintPrice;
        uint256 royaltyPercentage;
    }

    NFTMarketplace private _marketplace;
    modifier onlyMarketplace() {
        require(
            msg.sender == address(_marketplace),
            "Only marketplace can call"
        );
        _;
    }
    mapping(uint256 => Collection) private _collections;
    mapping(uint256 => uint256[]) private _nftCollections; // Mapping from collection ID to list of token IDs
    mapping(uint256 => uint256) private _nftToCollection; // Mapping from token ID to collection ID

    mapping(address => uint256) public collectionsCreated;
    mapping(address => uint256) public lastCollectionTimestamp;

    event CollectionCreated(uint256 id, string uri);
    event TokenMinted(uint256 tokenId, uint256 collectionId);
    event PriceSet(uint256 tokenId, uint256 price);

    constructor(
        string memory publicCollectionURI
    ) ERC721("ERC721Collections", "STR") {
        createCollection(publicCollectionURI, block.timestamp, 0, 0);
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
        uint256[] memory allTokens = _nftCollections[collectionId];
        if (allTokens.length == 0 || startIndex >= allTokens.length) {
            return new uint256[](0);
        }
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

    function getCollectionOwner(
        uint256 collectionId
    ) external view returns (address) {
        return _collections[collectionId].owner;
    }

    function createCollection(
        string memory uri,
        uint256 mintDate,
        uint256 mintPrice,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(
            collectionsCreated[msg.sender] < MAX_COLLECTIONS_PER_ADDRESS,
            "Max collections reached"
        );
        require(
            lastCollectionTimestamp[msg.sender] + TIME_BETWEEN_COLLECTIONS <=
                block.timestamp,
            "Must wait before creating another collection"
        );
        require(
            royaltyPercentage <= 100,
            "Royalties percentage should be less than 100"
        );
        _collectionIdTracker.increment();

        _collections[_collectionIdTracker.current()] = Collection({
            uri: uri,
            id: _collectionIdTracker.current(),
            owner: msg.sender,
            mintDate: mintDate,
            mintPrice: mintPrice,
            royaltyPercentage: royaltyPercentage
        });

        collectionsCreated[msg.sender]++;
        lastCollectionTimestamp[msg.sender] = block.timestamp;

        emit CollectionCreated(_collectionIdTracker.current(), uri);

        return _collectionIdTracker.current();
    }

    function mint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price,
        uint256 royaltyPercentage,
        bool isMintToMarketplace
    ) public returns (uint256) {
        require(
            block.timestamp >= _collections[collectionId].mintDate,
            "Collection is not yet available for minting"
        );
        require(price >= MIN_PRICE, "Price must be at least MIN_PRICE");
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            royaltyPercentage <= 100,
            "Royalties percentage should be less than 100"
        );
        require(
            collectionId == 1 || _collections[collectionId].owner == msg.sender,
            "Not the owner of the collection"
        );
        setApprovalForAll(address(_marketplace), true);
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        _creators[newTokenId] = msg.sender;
        _creatorRoyalties[newTokenId] = royaltyPercentage;
        if (isMintToMarketplace) {
            _marketplace.listNFT(newTokenId, price, address(this));
        }
        emit TokenMinted(newTokenId, collectionId);

        return newTokenId;
    }

    function mintToCollection(
        uint256 collectionId,
        address to,
        string memory tokenURI,
        uint256 price
    )
        public
        onlyMarketplace
        returns (uint256 tokenId, address collectionOwner)
    {
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            block.timestamp >= _collections[collectionId].mintDate,
            "Collection is not yet available for minting"
        );
        require(
            price == _collections[collectionId].mintPrice,
            "Price should be equal to collections mint price"
        );
        setApprovalForAll(address(_marketplace), true);
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        _creators[newTokenId] = _collections[collectionId].owner;
        _creatorRoyalties[newTokenId] = _collections[collectionId]
            .royaltyPercentage;
        emit TokenMinted(newTokenId, collectionId);
        return (newTokenId, _collections[collectionId].owner);
    }

    function royaltyInfo(
        uint256 _tokenId,
        uint256 _salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        uint256 royaltyPercentage = _creatorRoyalties[_tokenId];
        uint256 royaltyAmount = (_salePrice * royaltyPercentage) / 100;
        return (_creators[_tokenId], royaltyAmount);
    }
}
