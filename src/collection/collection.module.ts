import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "../auth/jwt.strategy";
import { WalletRepository } from "../user-wallets/wallet.repository";
import { CollectionRepository } from "./collection.repository";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";

const collectionsPath = path.join(process.cwd(), "tmp", "collections");
if (!fs.existsSync(collectionsPath)) {
  fs.mkdirSync(collectionsPath, { recursive: true });
}
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, collectionsPath);
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
