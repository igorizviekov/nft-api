import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { WalletRepository } from "src/user-wallets/wallet.repository";
import { CollectionRepository } from "./collection.repository";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./collections"); // specify the destination folder for uploads
        },
      }),
    }),
    TypeOrmModule.forFeature([WalletRepository, CollectionRepository]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class CollectionModule {}
