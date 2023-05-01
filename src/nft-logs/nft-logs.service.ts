import { Injectable } from "@nestjs/common";
import { NftLogsRepository } from "./nft-logs.repository";
import { TransactionType } from "./nft-logs.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";

@Injectable()
export class NftLogsService {
  constructor(
    @InjectRepository(NftLogsRepository)
    private readonly nftLogsRepo: NftLogsRepository
  ) {}

  async getLogsForUser(userWallet: string): Promise<IResponse> {
    const logs = await this.nftLogsRepo.getLogsForUser(userWallet);
    console.log({ getLogsForUser: logs });
    return { status: "success", data: logs };
    // return logs.map((log) => NftLogsDto.fromEntity(log));
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
