// 1. start hardhat - npx hardhat node
// 2. deploy smart contract - npx hardhat run scripts/deploy.ts --network localhost

import { ethers } from "hardhat";

async function main() {
  const collectionsContractName = "ERC721Collections";
  const marketplaceContractName = "NFTMarketplace";

  const NFTCollection = await ethers.getContractFactory(
    collectionsContractName
  );
  const nftCollection = await NFTCollection.deploy();
  await nftCollection.deployed();
  console.log(
    `${collectionsContractName} deployed to ${nftCollection.address}`
  );

  const NFTMarketplace = await ethers.getContractFactory(
    marketplaceContractName
  );
  const marketplace = await NFTMarketplace.deploy(nftCollection.address as any);
  await marketplace.deployed();
  console.log(`${marketplaceContractName} deployed to ${marketplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
