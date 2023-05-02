import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";
import { WalletRepository } from "./wallet.repository";
import { WalletDto } from "./dto/wallet.dto";
import { UsersRepository } from "src/users/users.repository";
import { BlockchainRepository } from "src/blockchain/blockchain.repository";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletRepository)
    private walletsRepo: WalletRepository,
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    @InjectRepository(BlockchainRepository)
    private chainRepo: BlockchainRepository
  ) {}

  async getAll(): Promise<IResponse> {
    const userWallets = await this.walletsRepo.getAll();
    return { status: "success", data: userWallets };
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.walletsRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`User Wallet with id ${id} not found.`);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`User Wallet with id ${id} not found.`);
    }
  }

  async getUserWallets(id: string): Promise<IResponse> {
    try {
      const match = await this.usersRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      const userWallets = await this.walletsRepo.find({
        user_id: match.id,
      });
      return { status: "success", data: userWallets };
    } catch (e) {
      throw new NotFoundException(`User Wallet with id ${id} not found.`);
    }
  }

  async addWallet(wallet: WalletDto): Promise<IResponse> {
    try {
      const user = await this.usersRepo.findOne(wallet.user_id);
      if (!user) {
        throw new NotFoundException(
          `User with id ${wallet.user_id} not found.`
        );
      }
      const blockchain = await this.chainRepo.findOne(wallet.blockchain_id);
      if (!blockchain) {
        throw new NotFoundException(
          `Blockchain with id ${wallet.blockchain_id} not found.`
        );
      }
      const userWallet = await this.walletsRepo.createWallet(wallet);
      return { status: "success", data: userWallet };
    } catch (e) {
      throw new NotFoundException(
        "Network/user not found or wallet already exists"
      );
    }
  }

  async remove(id: string): Promise<IResponse> {
    try {
      const res = await this.walletsRepo.delete(id);
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
