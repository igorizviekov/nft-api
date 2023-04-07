import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { UsersRepository } from "src/users/users.repository";
import { NftController } from "./nft.controller";
import { NftService } from "./nft.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [NftController],
  providers: [NftService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class NftModule {}
