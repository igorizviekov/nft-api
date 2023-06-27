import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { WalletDto } from "./dto/wallet.dto";
import { Wallet } from "./wallet.entity";

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
  async getAll(): Promise<WalletDto[]> {
    const query = this.createQueryBuilder("user_wallet");

    query.select([
      "user_wallet.id",
      "user_wallet.user_id",
      "user_wallet.blockchain_id",
      "user_wallet.wallet_address",
    ]);

    const userWallets = await query.getMany();
    return userWallets;
  }

  async createWallet(walletData: WalletDto): Promise<WalletDto> {
    const userWallet: WalletDto = this.create(walletData);
    try {
      await this.save(userWallet);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return userWallet;
  }

  async walletExists(walletAddress: string): Promise<boolean> {
    const wallet = await this.findOne({ wallet_address: walletAddress });
    return !!wallet;
  }
}
