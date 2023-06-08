// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC721Collections is IERC721 {
    function getPrice(uint256 tokenId) external view returns (uint256 price);

    function setPrice(uint256 tokenId, uint256 price) external;
}

contract NFTMarketplace is Ownable, ReentrancyGuard {
    IERC721Collections private _nftContract;
    address payable owner;

    mapping(uint256 => bool) private _listedTokens;

    event NFTListed(uint256 indexed tokenId);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId);

    constructor(address nftContractAddress) {
        _nftContract = IERC721Collections(nftContractAddress);
        owner = payable(msg.sender);
    }

    function listNFT(uint256 tokenId) public {
        require(
            msg.sender == _nftContract.ownerOf(tokenId),
            "Caller is not owner of NFT"
        );
        require(!_listedTokens[tokenId], "NFT already listed");

        // check NFTCollection contract if the sender address is the owner of the token ID, or an approved operator of the owner
        _nftContract.approve(address(this), tokenId);
        _listedTokens[tokenId] = true;

        emit NFTListed(tokenId);
    }

    function delistNFT(uint256 tokenId) public {
        require(
            msg.sender == _nftContract.ownerOf(tokenId) || msg.sender == owner,
            "Caller is not owner of NFT, nor the Marketplace"
        );
        require(_listedTokens[tokenId], "NFT not listed");

        _listedTokens[tokenId] = false;

        // revoke access to the NFT from the Marketplace
        _nftContract.approve(address(0), tokenId);

        emit NFTDelisted(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable nonReentrant {
        require(_listedTokens[tokenId], "NFT not listed for sale");
        require(
            msg.value == _nftContract.getPrice(tokenId),
            "Sent value does not match the NFT price"
        );
        _listedTokens[tokenId] = false;

        address nftOwner = _nftContract.ownerOf(tokenId);
        payable(nftOwner).transfer(msg.value);

        _nftContract.transferFrom(nftOwner, msg.sender, tokenId);

        emit NFTBought(tokenId);
    }
}
