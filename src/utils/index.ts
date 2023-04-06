import { ethers } from "ethers";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { MarketAddress, MarketAddressABI } from "src/constants/constants";
/**
 * Connect to the smart contract
 */
export const fetchContract = (signer: JsonRpcSigner | JsonRpcProvider) =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signer);
