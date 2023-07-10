// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC721Collections is IERC721 {
    function getPrice(uint256 tokenId) external view returns (uint256 price);

    function getCollectionOwner(
        uint256 collectionId
    ) external view returns (address);

    function setPrice(uint256 tokenId, uint256 price) external;

    function lazyMint(
        uint256 collectionId,
        string memory tokenURI,
        uint256 price,
        address to
    ) external returns (uint256);

    function getNFTsInCollection(
        uint256 collectionId,
        uint256 startIndex,
        uint256 pageSize
    ) external view returns (uint256[] memory);
}

/**
 * @title NFTMarketplace
 * @dev A contract for buying and selling NFTs, with support for royalties.
 * Inherits from OpenZeppelin's Ownable, ReentrancyGuard, and PaymentSplitter contracts.
 */
contract NFTMarketplace is Ownable, ReentrancyGuard, PaymentSplitter {
    using SafeMath for uint256;
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

    struct MintRequest {
        uint256 collectionId;
        string tokenURI;
        uint256 price;
        address buyer;
        bool approved;
    }

    mapping(uint256 => MintRequest) public mintRequests;
    uint256 public mintRequestIdTracker = 1;

    event NFTListed(uint256 indexed tokenId);
    event NFTDelisted(uint256 indexed tokenId);
    event NFTBought(uint256 indexed tokenId);
    event MintRequestApproved(uint256 requestId, uint256 tokenId);
    event TokenMintRequest(
        uint256 indexed requestId,
        address buyer,
        string tokenURI,
        uint256 price
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
        _nftContract = IERC721Collections(nftContractAddress);
        _royalties = royalties;
    }

    function isTokenListed(uint256 tokenId) public view returns (bool) {
        return _listedTokens[tokenId];
    }

    /**
     * @dev get all NFT listed for sale
     */
    function getListedTokensInCollection(
        uint256 collectionId,
        uint256 startIndex,
        uint256 pageSize
    ) public view returns (uint256[] memory) {
        uint256[] memory listedNFTs = new uint256[](pageSize);
        uint256 count = 0;
        uint256[] memory collectionTokens = _nftContract.getNFTsInCollection(
            collectionId,
            startIndex,
            pageSize
        );

        if (collectionTokens.length == 0) {
            return listedNFTs;
        }

        for (uint256 i = 0; i < collectionTokens.length; i++) {
            uint256 tokenId = collectionTokens[i];
            if (_listedTokens[tokenId]) {
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

    function buyNFT(
        uint256 tokenId,
        uint256 collectionId,
        string memory tokenURI
    ) public payable nonReentrant {
        uint256 price;
        address nftOwner;

        if (tokenId != 0) {
            require(_listedTokens[tokenId], "NFT not listed for sale");
            price = _nftContract.getPrice(tokenId);
            nftOwner = _nftContract.ownerOf(tokenId);
            require(nftOwner != msg.sender, "Owner cannot buy their own NFT");
            require(
                msg.value == price,
                "Sent value does not match the NFT price"
            );

            uint256 royaltiesAmount = price.mul(_royalties).div(100);

            require(
                price > royaltiesAmount,
                "Price should be higher than total royalties"
            );
            uint256 sellerAmount = price.sub(royaltiesAmount);

            _listedTokens[tokenId] = false;

            (bool success, ) = payable(nftOwner).call{value: sellerAmount}("");
            require(success, "Transfer to NFT owner failed.");

            _nftContract.transferFrom(nftOwner, msg.sender, tokenId);

            emit NFTBought(tokenId);
        } else {
            require(msg.value >= MIN_PRICE, "Price must be at least MIN_PRICE");
            require(msg.value <= MAX_PRICE, "Price must not exceed MAX_PRICE");
            require(
                bytes(tokenURI).length > 0,
                "Token URI is required for minting"
            );
            require(collectionId != 1, "");
            require(collectionId != 0, "Collection ID is required for minting");
            address collectionOwner = _nftContract.getCollectionOwner(
                collectionId
            );
            (collectionId);
            require(
                collectionOwner != msg.sender,
                "Collection owner should not request NFTs in their own collection"
            );
            mintRequests[mintRequestIdTracker] = MintRequest({
                collectionId: collectionId,
                tokenURI: tokenURI,
                price: msg.value,
                buyer: msg.sender,
                approved: false
            });

            emit TokenMintRequest(
                mintRequestIdTracker,
                msg.sender,
                tokenURI,
                msg.value
            );

            mintRequestIdTracker++;
        }
    }

    /**
     * @dev Returns the details of a mint request by ID.
     */
    function getMintRequestDetails(
        uint256 requestId
    )
        public
        view
        returns (
            uint256 collectionId,
            string memory tokenURI,
            uint256 price,
            address buyer,
            bool approved
        )
    {
        require(
            requestId < mintRequestIdTracker && requestId >= 1,
            "The provided request ID is invalid"
        );

        MintRequest storage request = mintRequests[requestId];
        return (
            request.collectionId,
            request.tokenURI,
            request.price,
            request.buyer,
            request.approved
        );
    }

    function approveMintRequest(uint256 requestId) public nonReentrant {
        MintRequest storage request = mintRequests[requestId];
        require(request.buyer != address(0), "Mint request does not exist");
        require(!request.approved, "Mint request already approved");
        address collectionOwner = _nftContract.getCollectionOwner(
            request.collectionId
        );
        require(
            collectionOwner == msg.sender,
            "Only the collection owner can approve the mint request"
        );
        uint256 royaltiesAmount = request.price.mul(_royalties).div(100);
        require(
            request.price > royaltiesAmount,
            "Price should be higher than total royalties"
        );

        uint256 collectionOwnerAmount = request.price.sub(royaltiesAmount);

        (bool success, ) = payable(collectionOwner).call{
            value: collectionOwnerAmount
        }("");
        require(success, "Transfer to Collection owner failed.");

        uint256 tokenId = _nftContract.lazyMint(
            request.collectionId,
            request.tokenURI,
            request.price,
            request.buyer
        );
        request.approved = true;
        emit MintRequestApproved(requestId, tokenId);
        emit NFTBought(tokenId);
    }
}
