// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC721Collections is IERC721 {
    function getPrice(uint256 tokenId) external view returns (uint256 price);

    function setPrice(uint256 tokenId, uint256 price) external;
}

contract NFTMarketplace is Ownable {
    IERC721Collections private _nftContract;

    mapping(uint256 => bool) private _listedTokens;

    event NFTListed(uint256 indexed tokenId);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId);

    constructor(address nftContractAddress) {
        _nftContract = IERC721Collections(nftContractAddress);
    }

    function listNFT(uint256 tokenId) public {
        require(
            msg.sender == _nftContract.ownerOf(tokenId),
            "Caller is not owner of NFT"
        );
        require(!_listedTokens[tokenId], "NFT already listed");

        _listedTokens[tokenId] = true;
        _nftContract.approve(address(this), tokenId);

        emit NFTListed(tokenId);
    }

    function delistNFT(uint256 tokenId) public {
        require(
            msg.sender == _nftContract.ownerOf(tokenId),
            "Caller is not owner of NFT"
        );
        require(_listedTokens[tokenId], "NFT not listed");

        _listedTokens[tokenId] = false;
        _nftContract.approve(address(0), tokenId);

        emit NFTDelisted(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(_listedTokens[tokenId], "NFT not listed for sale");
        require(
            msg.value == _nftContract.getPrice(tokenId),
            "Sent value does not match the NFT price"
        );

        address nftOwner = _nftContract.ownerOf(tokenId);
        payable(nftOwner).transfer(msg.value);

        _nftContract.transferFrom(nftOwner, msg.sender, tokenId);
        _listedTokens[tokenId] = false;

        emit NFTBought(tokenId);
    }
}
