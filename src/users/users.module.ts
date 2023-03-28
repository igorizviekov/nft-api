import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, OAuth2Client],
})
export class UsersModule {}
