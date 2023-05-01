import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NftLogsService } from "./nft-logs.service";
import { NftLogsRepository } from "./nft-logs.repository";
import { NftLogsController } from "./nft-logs.controller";

@Module({
  imports: [TypeOrmModule.forFeature([NftLogsRepository])],
  providers: [NftLogsService],
  controllers: [NftLogsController],
})
export class NftLogsModule {}
