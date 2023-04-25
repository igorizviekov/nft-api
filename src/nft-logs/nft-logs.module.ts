import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NftLogsService } from "./nft-logs.service";
import { NftLogsRepository } from "./nft-logs.repository";
import { NftLogsController } from "./nft-logs.controller";
import { NftRepository } from "src/nft/nft.repository";

@Module({
  imports: [TypeOrmModule.forFeature([NftLogsRepository, NftRepository])],
  providers: [NftLogsService],
  controllers: [NftLogsController],
})
export class NftLogsModule {}
