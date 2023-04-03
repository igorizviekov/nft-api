import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { UsersRepository } from "src/users/users.repository";
import { NftController } from "./nft.controller";
import { NftService } from "./nft.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [
        MulterModule.register({
          dest: "./uploads",
        }),
        ConfigModule,
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get("JWT_EXPIRES"),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [NftController],
  providers: [NftService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class NftModule {}
