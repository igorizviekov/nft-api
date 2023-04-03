import { Injectable } from "@nestjs/common";

@Injectable()
export class NftService {
  async mintNft(
    name: string,
    description: string,
    price: number,
    file: File
  ): Promise<any> {
    console.log(file);
    return { status: "success", data: price };
  }
}
