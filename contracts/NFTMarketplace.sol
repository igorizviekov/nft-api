// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

interface IERC721Collections is IERC721 {
    function getPrice(uint256 tokenId) external view returns (uint256 price);

    function setPrice(uint256 tokenId, uint256 price) external;
}

/**
 * @title NFTMarketplace
 * @dev A contract for buying and selling NFTs, with support for royalties.
 * Inherits from OpenZeppelin's Ownable, ReentrancyGuard, and PaymentSplitter contracts.
 */
contract NFTMarketplace is Ownable, ReentrancyGuard, PaymentSplitter {
    /**
     * @dev IERC721Collections - an interface to interact with the NFT Collections contract.
     */
    IERC721Collections private _nftContract;

    /**
     * @dev The percentage of the sale price that will be kept as royalties
     */
    uint256 private _royalties;
    uint256 public constant MIN_PRICE = 0.01 ether;
    uint256 public constant MAX_PRICE = 10000 ether;

    mapping(uint256 => bool) private _listedTokens;

    event NFTListed(uint256 indexed tokenId);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId);

    /**
     * @dev Sets the values for {nftContractAddress}, {payees}, {shares}, and {royalties}.
     * Initializes the contract by setting the deployed NFT contract's address, the payees' addresses,
     * their corresponding shares, and the royalties rate.
     */
    constructor(
        address nftContractAddress,
        address[] memory payees,
        uint256[] memory shares,
        uint256 royalties
    ) PaymentSplitter(payees, shares) {
        require(payees.length > 0, "At least one payee is required");
        _nftContract = IERC721Collections(nftContractAddress);
        _royalties = royalties;
    }

    function isTokenListed(uint256 tokenId) public view returns (bool) {
        return _listedTokens[tokenId];
    }

    /**
     * @dev Lists an NFT for sale.
     * Requirements:
     * - The caller must be the owner of the NFT.
     * - The marketplace contract must be approved to manage all NFTs of the owner.
     * - The NFT must not be already listed for sale.
     * - The price must be greater than 0.
     */
    function listNFT(uint256 tokenId, uint256 newPrice) public nonReentrant {
        require(newPrice >= MIN_PRICE, "Price must be at least MIN_PRICE");
        require(newPrice <= MAX_PRICE, "Price must not exceed MAX_PRICE");
        require(newPrice > 0, "Price must be greater than 0");
        require(!_listedTokens[tokenId], "NFT already listed");
        require(
            _nftContract.ownerOf(tokenId) == msg.sender,
            "Must be owner of the NFT"
        );
        require(
            _nftContract.isApprovedForAll(msg.sender, address(this)) ||
                _nftContract.getApproved(tokenId) == address(this),
            "Must approve marketplace to manage the NFT"
        );

        _nftContract.setPrice(tokenId, newPrice);
        _listedTokens[tokenId] = true;

        emit NFTListed(tokenId);
    }

    function delistNFT(uint256 tokenId) public nonReentrant {
        require(
            msg.sender == _nftContract.ownerOf(tokenId) ||
                msg.sender == owner(),
            "Caller is not owner of NFT or marketplace"
        );
        require(_listedTokens[tokenId], "NFT not listed");

        _listedTokens[tokenId] = false;

        emit NFTDelisted(tokenId);
    }

    /**
     * @dev Buys an NFT.
     * Requirements:
     * - The NFT must be listed for sale.
     * - The value sent must match the NFT's price.
     * - The price should be higher than total royalties.
     */
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        require(_listedTokens[tokenId], "NFT not listed for sale");
        uint256 price = _nftContract.getPrice(tokenId);
        require(msg.value == price, "Sent value does not match the NFT price");

        uint256 royaltiesAmount = (price * _royalties) / 100;
        require(
            price > royaltiesAmount,
            "Price should be higher than total royalties"
        );

        uint256 sellerAmount = price - royaltiesAmount;

        address nftOwner = _nftContract.ownerOf(tokenId);

        payable(nftOwner).transfer(sellerAmount);
        payable(address(this)).transfer(royaltiesAmount);

        _nftContract.transferFrom(nftOwner, msg.sender, tokenId);
        _listedTokens[tokenId] = false;

        emit NFTBought(tokenId);
    }
}
