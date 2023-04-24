import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { NftController } from "./nft.controller";
import { NftService } from "./nft.service";
import { WalletRepository } from "src/user-wallets/wallet.repository";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([WalletRepository]),
  ],
  controllers: [NftController],
  providers: [NftService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class NftModule {}
