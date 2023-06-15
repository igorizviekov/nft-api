import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { User } from "./users.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/jwt-payload.interface";
import { IResponse } from "src/app.types";
import { WalletRepository } from "src/user-wallets/wallet.repository";
import { AuthUserDto } from "./dto/auth-user.dto";
import { WalletDto } from "src/user-wallets/dto/wallet.dto";
import { BlockchainRepository } from "src/blockchain/blockchain.repository";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    @InjectRepository(WalletRepository)
    private walletRepo: WalletRepository,
    @InjectRepository(BlockchainRepository)
    private chainRepo: BlockchainRepository,
    private jwtService: JwtService
  ) {}

  async getUsers(
    search: string,
    limit: number,
    offset: number
  ): Promise<IResponse> {
    const users = await this.usersRepo.getUsers(search, limit, offset);
    return { status: "success", data: users };
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.usersRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async signUp(authData: RegisterUserDto): Promise<User> {
    try {
      const { wallet, blockchain_id, ...userData } = authData;
      const blockchain = await this.chainRepo.findOne(blockchain_id);
      if (!blockchain) {
        throw new NotFoundException(
          `Blockchain with id ${blockchain_id} not found.`
        );
      }
      const isWalletExists = await this.walletRepo.walletExists(wallet);
      if (isWalletExists) {
        throw new UnauthorizedException(`Wallet ${wallet} already exits`);
      }
      const user = await this.usersRepo.createUser(userData as User);

      await this.walletRepo.createWallet({
        wallet_address: wallet,
        blockchain_id,
        user_id: user.id,
      } as WalletDto);

      return user;
    } catch (e) {
      console.log({ e });
      const error = e as Error;
      throw new UnauthorizedException(
        `Please check your credentials: ${error?.message}`
      );
    }
  }

  async signIn(credentials: AuthUserDto): Promise<IResponse> {
    const { wallet } = credentials;
    const userWallet = await this.walletRepo.findOne({
      wallet_address: wallet,
    });
    if (!userWallet) {
      throw new UnauthorizedException("Please check your login credentials.");
    }
    const payload: JwtPayload = { wallet };
    const accessToken: string = this.jwtService.sign(payload);
    return {
      status: "success",
      data: { accessToken: accessToken, usersUID: userWallet.user_id },
    };
  }

  async update(id: string, UserToUpdate: UserDto): Promise<IResponse> {
    const { data } = await this.getById(id);
    Object.keys(UserToUpdate).forEach((key) => {
      data[key] = UserToUpdate[key];
    });

    await this.usersRepo.update(id, data as User);
    return { status: "success", data };
  }

  async remove(id: string): Promise<IResponse> {
    try {
      const res = await this.usersRepo.delete(id);
      if (res.affected === 0) {
        throw new NotFoundException(`User with ${id} not found.`);
      }
      return {
        status: "delete success",
      };
    } catch (e) {
      throw new NotFoundException(`User with ${id} not found.`);
    }
  }
}
