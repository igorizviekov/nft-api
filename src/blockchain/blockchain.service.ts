import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IResponse } from "src/app.types";
import { BlockchainRepository } from "./blockchain.repository";
import { BlockchainDto } from "./dto/blockchain.dto";
import { Blockchain } from "./blockchain.entity";

@Injectable()
export class BlockchainService {
  constructor(
    @InjectRepository(BlockchainRepository)
    private chainsRepo: BlockchainRepository
  ) {}

  async getAll(): Promise<IResponse> {
    const blockchains = await this.chainsRepo.getAll();
    return { status: "success", data: blockchains };
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.chainsRepo.findOne(id, {
        select: ["id", "name", "network_id"],
      });
      if (!match) {
        throw new NotFoundException(`Blockchain with id ${id} not found.`);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`Blockchain with id ${id} not found.`);
    }
  }

  async addChain(chain: BlockchainDto): Promise<IResponse> {
    const blockchain = await this.chainsRepo.createBlockchain(chain);
    return { status: "success", data: blockchain };
  }

  async update(id: string, ChainToUpdate: BlockchainDto): Promise<IResponse> {
    const { data } = await this.getById(id);
    Object.keys(ChainToUpdate).forEach((key) => {
      data[key] = ChainToUpdate[key];
    });

    await this.chainsRepo.update(id, data as Blockchain);
    return { status: "success", data };
  }

  async remove(id: string): Promise<IResponse> {
    try {
      const res = await this.chainsRepo.delete(id);
      if (res.affected === 0) {
        throw new NotFoundException(`Blockchain with ${id} not found.`);
      }
      return {
        status: "delete success",
      };
    } catch (e) {
      throw new NotFoundException(`Blockchain with ${id} not found.`);
    }
  }
}
