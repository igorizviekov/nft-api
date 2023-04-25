import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigValidationSchema } from "./config.schema";
import { UsersModule } from "./users/users.module";
import { NftModule } from "./nft/nft.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { WalletModule } from "./user-wallets/wallet.module";
import { NftLogsModule } from "./nft-logs/nft-logs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: ConfigValidationSchema,
    }),
    UsersModule,
    NftModule,
    NftLogsModule,
    BlockchainModule,
    WalletModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        //database env variables
        return {
          type: "postgres",
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule {}
