import { Controller, Get, Param, Query } from "@nestjs/common";
import { NftLogsService } from "./nft-logs.service";
import { TransactionType } from "./nft-logs.enum";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { IResponse } from "src/app.types";

@Controller("nft-logs")
@ApiTags("NFT Logs")
export class NftLogsController {
  constructor(private readonly nftLogsService: NftLogsService) {}

  @Get("/:wallet_address/")
  @ApiParam({
    name: "wallet",
    type: String,
    description: "User wallet address",
  })
  async getLogsForUser(
    @Param("wallet") userWallet: string
  ): Promise<IResponse> {
    return this.nftLogsService.getLogsForUser(userWallet);
  }

  @Get("/:nft_id/")
  @ApiParam({
    name: "id",
    type: String,
    description: "Unique id from the NFT database",
  })
  async getLogsForNft(@Param("id") id: string): Promise<IResponse> {
    return this.nftLogsService.getLogsForNft(id);
  }

  @Get()
  @ApiQuery({ name: "transactionType", enum: TransactionType, required: false })
  @ApiQuery({ name: "startDate", type: Date, required: false })
  @ApiQuery({ name: "endDate", type: Date, required: false })
  async getAllLogs(
    @Query("transactionType") transactionType?: TransactionType,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<IResponse> {
    return this.nftLogsService.getAllLogs(transactionType, startDate, endDate);
  }
}
