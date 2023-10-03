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
    struct Collection {
        string uri;
        uint256 id;
        address owner;
        uint256 mintDate;
        uint256 mintPrice;
        uint256 royaltyPercent;
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
    mapping(uint256 => uint256[]) private _nftCollections;
    mapping(uint256 => uint256) private _nftToCollection;
    mapping(address => uint256) public collectionsCreated;
    mapping(address => uint256) public lastCollectionTimestamp;
    event CollectionCreated(uint256 id, string uri);
    event TokenMinted(uint256 tokenId, uint256 collectionId);
    event MintPriceChanged(uint256 collectionId, uint256 newMintPrice);

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

    function getAllCollections(
        uint256 offset,
        uint256 limit
    ) external view returns (Collection[] memory) {
        uint256 startIndex = offset + 1;
        require(
            startIndex >= 1 && startIndex <= _collectionIdTracker.current(),
            "Invalid offset"
        );
        uint256 actualLimit = 0;
        uint256[] memory collectionIds = new uint256[](limit);
        for (uint256 i = 0; i < limit; i++) {
            uint256 collectionId = startIndex + i;
            if (collectionId <= _collectionIdTracker.current()) {
                collectionIds[actualLimit] = collectionId;
                actualLimit++;
            }
        }
        Collection[] memory collections = new Collection[](actualLimit);
        for (uint256 i = 0; i < actualLimit; i++) {
            collections[i] = _collections[collectionIds[i]];
        }
        return collections;
    }

    function getCollectionsForOwner(
        address owner,
        uint256 offset,
        uint256 limit
    ) public view returns (Collection[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _collectionIdTracker.current(); i++) {
            if (_collections[i].owner == owner) {
                count++;
            }
        }
        if (offset >= count) {
            return new Collection[](0);
        }
        uint256 actualLimit = count - offset > limit ? limit : count - offset;
        Collection[] memory ownerCollections = new Collection[](actualLimit);
        uint256 index = 0;
        uint256 iterCount = 0;
        for (uint256 i = 1; i <= _collectionIdTracker.current(); i++) {
            if (_collections[i].owner == owner) {
                if (iterCount >= offset && index < actualLimit) {
                    ownerCollections[index] = _collections[i];
                    index++;
                }
                iterCount++;
            }
            if (index == actualLimit) {
                break;
            }
        }
        return ownerCollections;
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
        uint256 royaltyPercent
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
            royaltyPercent <= 10,
            "Royalties percentage should be less than 10"
        );
        _collectionIdTracker.increment();
        _collections[_collectionIdTracker.current()] = Collection({
            uri: uri,
            id: _collectionIdTracker.current(),
            owner: msg.sender,
            mintDate: mintDate,
            mintPrice: mintPrice,
            royaltyPercent: royaltyPercent
        });
        collectionsCreated[msg.sender]++;
        lastCollectionTimestamp[msg.sender] = block.timestamp;
        emit CollectionCreated(_collectionIdTracker.current(), uri);
        return _collectionIdTracker.current();
    }

    function changeMintPrice(
        uint256 collectionId,
        uint256 newMintPrice
    ) public {
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            msg.sender == _collections[collectionId].owner,
            "Not the owner of the collection"
        );
        require(
            newMintPrice >= MIN_PRICE,
            "New mint price must be at least MIN_PRICE"
        );
        _collections[collectionId].mintPrice = newMintPrice;
        emit MintPriceChanged(collectionId, newMintPrice);
    }

    function mint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price,
        bool isMintToMarketplace,
        address airdropAddress
    ) public returns (uint256) {
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            !(airdropAddress != address(0) && isMintToMarketplace),
            "Cannot mint to marketplace when airdrop address is provided"
        );
        if (isMintToMarketplace) {
            require(price >= MIN_PRICE, "Price must be at least MIN_PRICE");
        }
        require(
            (collectionId == 1 && airdropAddress == address(0)) ||
                _collections[collectionId].owner == msg.sender,
            "Not the owner of the collection"
        );
        require(
            block.timestamp >= _collections[collectionId].mintDate,
            "Collection is not yet available for minting"
        );
        setApprovalForAll(address(_marketplace), true);
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        address mintToAddress = airdropAddress == address(0)
            ? msg.sender
            : airdropAddress;
        _mint(mintToAddress, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
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
        payable
        onlyMarketplace
        returns (uint256 tokenId, address collectionOwner)
    {
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(
            _collections[collectionId].id != 1,
            "Can not mint to public Collection"
        );
        require(
            block.timestamp >= _collections[collectionId].mintDate,
            "Collection is not yet available for minting"
        );
        require(
            price == _collections[collectionId].mintPrice,
            "Price should be equal to collections mint price"
        );
        require(
            to != _collections[collectionId].owner,
            "Owner can not buy from collection"
        );
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        emit TokenMinted(newTokenId, collectionId);
        return (newTokenId, _collections[collectionId].owner);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(IERC165, ERC721URIStorage) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        Collection memory collection = getCollectionOfToken(tokenId);
        uint256 royaltyAmount = (salePrice * collection.royaltyPercent) / 100;
        return (collection.owner, royaltyAmount);
    }
}
