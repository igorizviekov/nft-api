// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Collections is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    Counters.Counter private _collectionIdTracker;

    struct Collection {
        string name;
        uint256 id;
    }

    mapping(uint256 => Collection) private _collections;
    mapping(uint256 => uint256[]) private _nftCollections; // Mapping from collection ID to list of token IDs
    mapping(uint256 => uint256) private _nftToCollection; // Mapping from token ID to collection ID
    mapping(uint256 => uint256) private _tokenPrices; // Mapping from token ID to its price

    constructor() ERC721("ERC721Collections", "STR") {}

    function createCollection(string memory name) public returns (uint256) {
        _collectionIdTracker.increment();

        _collections[_collectionIdTracker.current()] = Collection({
            name: name,
            id: _collectionIdTracker.current()
        });

        return _collectionIdTracker.current();
    }

    function getCollection(uint256 id) public view returns (Collection memory) {
        return _collections[id];
    }

    function getNFTsInCollection(
        uint256 collectionId
    ) public view returns (uint256[] memory) {
        return _nftCollections[collectionId];
    }

    function mint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price
    ) public returns (uint256) {
        require(
            _collections[collectionId].id != 0,
            "Collection does not exist"
        );
        require(price > 0, "Price must be greater than 0");
        uint256 newTokenId = _tokenIdTracker.current();
        _tokenIdTracker.increment();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _nftToCollection[newTokenId] = collectionId;
        _nftCollections[collectionId].push(newTokenId);
        _tokenPrices[newTokenId] = price;
        return newTokenId;
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }

    function setPrice(uint256 tokenId, uint256 price) public returns (uint256) {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        require(ownerOf(tokenId) == msg.sender, "Only owner can set the price");
        require(_tokenPrices[tokenId] != 0, "Price not set");
        _tokenPrices[tokenId] = price;
        return _tokenPrices[tokenId];
    }
}
