import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { create as ipfsClient } from "ipfs-http-client";
import { ethers } from "ethers";
import { fetchContract } from "src/utils";
import { Nft } from "./nft.entity";
import { MarketAddress } from "src/constants/constants";
import { IResponse } from "src/app.types";
@Injectable()
export class NftService {
  constructor(private configService: ConfigService) {}

  async mintNft(file, price: number, metadata): Promise<IResponse> {
    const { buffer } = file;

    /**
     * Authenticate to Infura
     *
     * https://app.infura.io/
     * https://ipfs.tech/
     */
    const auth =
      "Basic " +
      Buffer.from(
        `${this.configService.get(
          "INFURA_PROJECT_ID"
        )}:${this.configService.get("INFURA_SECRET")}`
      ).toString("base64");

    const options = {
      url: "https://ipfs.infura.io:5001/api/v0",
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    };
    const client = ipfsClient(options);

    /**
     * Upload file to Infura
     */
    const addedImage = await client.add({
      content: buffer,
    });
    /**
     * Upload NFT data to Infura
     */
    const data = JSON.stringify({
      price,
      // url of Infura project plus id of uploaded image
      image: `https://${this.configService.get(
        "INFURA_PROJECT_NAME"
      )}.infura-ipfs.io/ipfs/${addedImage.path}`,
      metadata: JSON.parse(metadata as unknown as string),
    });

    /**
     * Upload file to Infura
     */
    const addedNFT = await client.add(data);

    const nftURL = `https://${this.configService.get(
      "INFURA_PROJECT_NAME"
    )}.infura-ipfs.io/ipfs/${addedNFT.path}`;

    const provider = new ethers.providers.JsonRpcProvider();

    /**
     * Person who is creating an NFT
     */
    const signer = provider.getSigner();

    /**
     * Get access to the Solidity Smart Contract api
     */
    const contract = fetchContract(signer);

    /**
     * Convert price value from the form input to the blockchain readable format
     */
    const bPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const listingPrice = await contract.getListingPrice();
    const transaction = await contract.createToken(bPrice, nftURL, {
      value: listingPrice,
    });

    await transaction.wait();
    const nft = new Nft();

    nft.price = price;
    nft.contractAddress = MarketAddress;
    nft.metadata = metadata as unknown as string;

    return { status: "success", data: nft };
  }
}
