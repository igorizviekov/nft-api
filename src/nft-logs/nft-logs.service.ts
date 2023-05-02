import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NftLogsRepository } from "./nft-logs.repository";
import { TransactionType } from "./nft-logs.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";
import { NftLogsDto } from "./dto/nft-logs.dto";

@Injectable()
export class NftLogsService {
  constructor(
    @InjectRepository(NftLogsRepository)
    private readonly nftLogsRepo: NftLogsRepository
  ) {}

  async getLogsForUser(userWallet: string): Promise<IResponse> {
    try {
      const logs = await this.nftLogsRepo.getLogsForUser(userWallet);
      return { status: "success", data: logs };
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        "An error occurred while getting Logs for a user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllLogs(
    transactionType?: TransactionType,
    startDate?: string,
    endDate?: string
  ): Promise<IResponse> {
    try {
      const logs = await this.nftLogsRepo.getAllLogs(
        transactionType,
        startDate,
        endDate
      );
      return { status: "success", data: logs };
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        "An error occurred while getting all Logs",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addOne(log: NftLogsDto): Promise<IResponse> {
    try {
      const res = await this.nftLogsRepo.createLog(log);
      return { status: "success", data: res };
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        "An error occurred while adding a Log",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addMultiple(logs: NftLogsDto[]): Promise<IResponse> {
    try {
      const res = await this.nftLogsRepo.createLogs(logs);
      return { status: "success", data: res };
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        "An error occurred while adding Logs",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
