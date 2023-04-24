import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { BlockchainRepository } from "./blockchain.repository";
import { BlockchainController } from "./blockchain.controller";
import { BlockchainService } from "./blockchain.service";
import { UsersRepository } from "src/users/users.repository";
import { WalletRepository } from "src/user-wallets/wallet.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([
      WalletRepository,
      BlockchainRepository,
      UsersRepository,
    ]),
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class BlockchainModule {}
