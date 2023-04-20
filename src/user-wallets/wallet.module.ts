import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletRepository } from "./wallet.repository";
import { UsersRepository } from "src/users/users.repository";
import { WalletsController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { BlockchainRepository } from "src/blockchain/blockchain.repository";

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
  controllers: [WalletsController],
  providers: [WalletService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class WalletModule {}
