import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigValidationSchema } from "./config.schema";
import { UsersModule } from "./users/users.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { WalletModule } from "./user-wallets/wallet.module";
import { NftLogsModule } from "./nft-logs/nft-logs.module";
import { CollectionModule } from "./collection/collection.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.STAGE === "prod" ? ".env.prod" : ".env.stage.dev",
      validationSchema: ConfigValidationSchema,
    }),
    UsersModule,
    NftLogsModule,
    BlockchainModule,
    WalletModule,
    CollectionModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        //database env variables
        return {
          type: "postgres",
          url: configService.get("DATABASE_URL"),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule {}
