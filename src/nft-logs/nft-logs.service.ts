import { Injectable, NotFoundException } from "@nestjs/common";
import { NftLogsRepository } from "./nft-logs.repository";
import { TransactionType } from "./nft-logs.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";
import { NftRepository } from "src/nft/nft.repository";

@Injectable()
export class NftLogsService {
  constructor(
    @InjectRepository(NftLogsRepository)
    private readonly nftLogsRepo: NftLogsRepository,
    @InjectRepository(NftRepository)
    private readonly nftRepo: NftRepository
  ) {}

  async getLogsForUser(userWallet: string): Promise<IResponse> {
    const logs = await this.nftLogsRepo.getLogsForUser(userWallet);
    console.log({ getLogsForUser: logs });
    return { status: "success", data: logs };
    // return logs.map((log) => NftLogsDto.fromEntity(log));
  }

  async getLogsForNft(id: string): Promise<IResponse> {
    try {
      const match = await this.nftRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`NFT with id ${id} not found.`);
      }
      const logs = await this.nftLogsRepo.getLogsForNft(match.id);
      console.log({ getLogsForNft: logs });

      return { status: "success", data: logs };
    } catch (e) {
      throw new NotFoundException(`Logs for NFT with id ${id} not found.`);
    }
  }

  async getAllLogs(
    transactionType?: TransactionType,
    startDate?: string,
    endDate?: string
  ): Promise<IResponse> {
    const logs = await this.nftLogsRepo.getAllLogs(
      transactionType,
      startDate,
      endDate
    );
    console.log({ getAllLogs: logs });
    return { status: "success", data: logs };
    // return logs.map((log) => NftLogsDto.fromEntity(log));
  }
}
