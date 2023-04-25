import { Controller, Get, Param, Query } from "@nestjs/common";
import { NftLogsService } from "./nft-logs.service";
import { TransactionType } from "./nft-logs.enum";
import { ApiTags } from "@nestjs/swagger";
import { IResponse } from "src/app.types";

@Controller("nft-logs")
@ApiTags("NFT Logs")
export class NftLogsController {
  constructor(private readonly nftLogsService: NftLogsService) {}

  @Get("/nft-logs/:wallet/")
  async getLogsForUser(
    @Param("wallet") userWallet: string
  ): Promise<IResponse> {
    return this.nftLogsService.getLogsForUser(userWallet);
  }

  @Get("/nft-logs/:nft/")
  async getLogsForNft(@Param("id") id: string): Promise<IResponse> {
    return this.nftLogsService.getLogsForNft(id);
  }

  @Get()
  async getAllLogs(
    @Query("transactionType") transactionType?: TransactionType,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<IResponse> {
    return this.nftLogsService.getAllLogs(transactionType, startDate, endDate);
  }
}
