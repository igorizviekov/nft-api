// 1. start hardhat - npx hardhat node
// 2. deploy smart contract - npx hardhat run scripts/deploy.ts --network localhost

import { ethers } from "hardhat";

async function main() {
  const collectionsContractName = "ERC721Collections";
  const marketplaceContractName = "NFTMarketplace";

  const NFTCollection = await ethers.getContractFactory(
    collectionsContractName
  );
  const nftCollection = await NFTCollection.deploy(
    "https://ipfs.io/ipfs/QmaNfrXqMu8j2UdNDj881r3VnaXoAGrpDbJoDRJRXwfdaU"
  );
  await nftCollection.deployed();
  console.log(
    `${collectionsContractName} deployed to ${nftCollection.address}`
  );

  const NFTMarketplace = await ethers.getContractFactory(
    marketplaceContractName
  );
  /**
   * Deploys the NFTMarketplace contract.
   *
   * @param {string} collectionsContractAddress - The address of the NFT collections contract.
   * @param {Array.<string>} royaltyRecipients - Array of recipient addresses to receive royalty payments.
   * @param {Array.<number>} shares - Array of share percentages corresponding to each recipient.
   * @param {number} royalties - The total royalties percentage (0-50).
   *
   * @returns {Promise<Contract>} Returns a promise that resolves to a Contract. This represents the deployed NFTMarketplace contract.
   *
   * @throws Will throw an error if deployment fails.
   *
   * @example
   * const marketplace = await NFTMarketplace.deploy(
   *   nftMarketplaceOptions.collectionsContractAddress,
   *   nftMarketplaceOptions.royaltyRecipients,
   *   nftMarketplaceOptions.shares,
   *   nftMarketplaceOptions.royalties
   * );
   */

  const nftMarketplaceOptions = {
    collectionsContractAddress: nftCollection.address as any,
    royalties: 5,
    royaltyRecipients: [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    ],
    shares: [1, 1, 1], // equal amount
  };

  const marketplace = await NFTMarketplace.deploy(
    nftMarketplaceOptions.collectionsContractAddress, // nftContractAddress
    nftMarketplaceOptions.royaltyRecipients, // payees
    nftMarketplaceOptions.shares,
    nftMarketplaceOptions.royalties
  );

  await marketplace.deployed();

  await nftCollection.setMarketplace(marketplace.address);
  console.log(`${marketplaceContractName} deployed to ${marketplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
