import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { create as ipfsClient } from "ipfs-http-client";
import { MarketAddress, MarketAddressABI } from "src/constants/constants";
import { IResponse } from "src/app.types";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ethers } from "ethers";
import { fetchContract } from "src/utils";
import axios from "axios";

@Injectable()
export class NftService {
  constructor(private configService: ConfigService) {}

  async mintNft(file, price: number, metadata): Promise<IResponse> {
    try {
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

      return {
        status: "success",
        data: { MarketAddress, MarketAddressABI, nftURL },
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Error creating new NFT",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNfts(chain: string): Promise<IResponse> {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider, chain);
      const nftData = await contract.getActiveCocktails();
      const items = await Promise.all(
        nftData.map(async ({ tokenId, seller, owner, price }) => {
          const formattedPrice = ethers.utils.formatUnits(
            price.toString(),
            "ether"
          );
          const tokenURI: string = await contract.tokenURI(tokenId);

          // get NFT metadata and image
          const res = await axios.get(tokenURI);
          return {
            price: formattedPrice,
            tokenId: Number(tokenId),
            seller,
            owner,
            ...res.data,
          };
        })
      );

      return {
        status: "success",
        data: { items },
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "Error creating new NFT",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getContract(chain: string): Promise<IResponse> {
    if (chain === "MATIC") {
      return {
        status: "success",
        data: { MarketAddress, MarketAddressABI },
      };
    }

    return {
      status: "success",
      data: { MarketAddress, MarketAddressABI },
    };
  }
}
