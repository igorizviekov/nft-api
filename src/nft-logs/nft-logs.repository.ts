import { EntityRepository, Repository } from "typeorm";
import { NftLogsEntity } from "./nft-logs.entity";
import { TransactionType } from "./nft-logs.enum";
import { InternalServerErrorException } from "@nestjs/common";

@EntityRepository(NftLogsEntity)
export class NftLogsRepository extends Repository<NftLogsEntity> {
  async getLogsForUser(userAddress: string): Promise<NftLogsEntity[]> {
    return this.createQueryBuilder("nftLogs")
      .where(
        "nftLogs.seller_address = :userAddress OR nftLogs.buyer_address = :userAddress",
        { userAddress }
      )
      .getMany();
  }

  async getAllLogs(
    transactionType?: TransactionType,
    startDate?: string,
    endDate?: string
  ): Promise<NftLogsEntity[]> {
    let query = this.createQueryBuilder("nftLogs");

    if (transactionType) {
      query = query.andWhere("nftLogs.transaction_type = :transactionType", {
        transactionType,
      });
    }

    if (startDate) {
      query = query.andWhere("nftLogs.date >= :startDate", { startDate });
    }

    if (endDate) {
      query = query.andWhere("nftLogs.date <= :endDate", { endDate });
    }

    return query.getMany();
  }

  async createLog(log: NftLogsEntity): Promise<NftLogsEntity> {
    const nftLog: NftLogsEntity = this.create(log);
    try {
      await this.save(nftLog);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return nftLog;
  }

  async createLogs(logs: NftLogsEntity[]): Promise<NftLogsEntity[]> {
    const nftLogs: NftLogsEntity[] = logs.map((log) => this.create(log));
    try {
      await this.save(nftLogs);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return nftLogs;
  }
}
