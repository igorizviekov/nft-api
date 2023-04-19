import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Blockchain } from "./blockchain.entity";
import { BlockchainDto } from "./dto/blockchain.dto";

@EntityRepository(Blockchain)
export class BlockchainRepository extends Repository<BlockchainDto> {
  async getAll(): Promise<BlockchainDto[]> {
    const query = this.createQueryBuilder("blockchain");

    query.select(["blockchain.id", "blockchain.name", "blockchain.network_id"]);

    const blockchains = await query.getMany();
    return blockchains;
  }

  async createBlockchain(chainData: BlockchainDto): Promise<BlockchainDto> {
    const blockchain: BlockchainDto = this.create(chainData);
    try {
      await this.save(blockchain);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return blockchain;
  }
}
