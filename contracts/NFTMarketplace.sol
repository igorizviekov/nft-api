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

    address payable[] private royaltyRecipients;
    uint256 private royalties;
    uint256 totalRoyalty = royalties * royaltyRecipients.length;

    mapping(uint256 => bool) private _listedTokens;

    event NFTListed(uint256 indexed tokenId);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId);

    constructor(
        address nftContractAddress,
        address payable[] memory _royaltyRecipients,
        uint256 _royalties
    ) {
        require(
            _royaltyRecipients.length > 0,
            "At least one royalty recipient is required"
        );
        _nftContract = IERC721Collections(nftContractAddress);
        royaltyRecipients = _royaltyRecipients;
        royalties = _royalties;
    }

    function listNFT(uint256 tokenId, uint256 newPrice) public {
        require(newPrice > 0, "Price must be greater than 0");
        require(!_listedTokens[tokenId], "NFT already listed");
        require(
            msg.sender == _nftContract.ownerOf(tokenId),
            "Caller is not owner of NFT"
        );
        require(
            newPrice > totalRoyalty,
            "Price must be greater than total royalties"
        );

        _nftContract.approve(address(this), tokenId);
        _nftContract.setPrice(tokenId, newPrice);
        _listedTokens[tokenId] = true;

        emit NFTListed(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable nonReentrant {
        require(_listedTokens[tokenId], "NFT not listed for sale");
        uint256 price = _nftContract.getPrice(tokenId);
        require(msg.value == price, "Sent value does not match the NFT price");
        _listedTokens[tokenId] = false;

        require(
            price > totalRoyalty,
            "Price should be higher than total royalties"
        );

        uint256 sellerAmount = price - totalRoyalty;

        address nftOwner = _nftContract.ownerOf(tokenId);

        payable(nftOwner).transfer(sellerAmount);
        for (uint i = 0; i < royaltyRecipients.length; i++) {
            royaltyRecipients[i].transfer(royalties);
        }

        _nftContract.transferFrom(nftOwner, msg.sender, tokenId);
        emit NFTBought(tokenId);
    }
}
