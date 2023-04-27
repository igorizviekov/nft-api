import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { WalletRepository } from "src/user-wallets/wallet.repository";
import { CollectionRepository } from "./collection.repository";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([WalletRepository, CollectionRepository]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class CollectionModule {}
