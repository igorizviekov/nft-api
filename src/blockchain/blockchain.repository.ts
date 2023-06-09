import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Blockchain } from "./blockchain.entity";
import { BlockchainDto } from "./dto/blockchain.dto";

@EntityRepository(Blockchain)
export class BlockchainRepository extends Repository<Blockchain> {
  async getAll(): Promise<BlockchainDto[]> {
    const query = this.createQueryBuilder("blockchain");
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
