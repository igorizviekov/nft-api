import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { NftLogsService } from "./nft-logs.service";
import { TransactionType } from "./nft-logs.enum";
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { IResponse } from "src/app.types";
import { NftLogsDto } from "./dto/nft-logs.dto";

@Controller("nft-logs")
@ApiTags("NFT Logs")
export class NftLogsController {
  constructor(private readonly nftLogsService: NftLogsService) {}

  @Get("/users/:wallet/")
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

  @Post()
  @ApiOkResponse({
    description: "Add Log",
  })
  @ApiBody({ type: NftLogsDto })
  async addOne(@Body() log: NftLogsDto): Promise<IResponse> {
    return this.nftLogsService.addOne(log);
  }

  @Post("/multiple")
  @ApiOkResponse({
    description: "Add multiple logs",
  })
  @ApiBody({ type: NftLogsDto })
  async addMultiple(@Body() logs: NftLogsDto[]): Promise<IResponse> {
    return this.nftLogsService.addMultiple(logs);
  }
}
