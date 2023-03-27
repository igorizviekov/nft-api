import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { User } from "./users.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/jwt-payload.interface";
import { AuthUserDto } from "./dto/auth-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    private jwtService: JwtService
  ) {}

  getUsers(search: string, limit: number, offset: number): Promise<User[]> {
    return this.usersRepo.getUsers(search, limit, offset);
  }

  async getById(id: string): Promise<User> {
    try {
      const match = await this.usersRepo.findOne(id);
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return match;
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  signUp(userDto: UserDto): Promise<User> {
    return this.usersRepo.createUser(userDto);
  }

  async signIn(creadentials: UserDto): Promise<{ accessToken: string }> {
    const { login } = creadentials;
    const user = await this.usersRepo.findOne({ login });
    //if user exist in db, sign a jwt token
    if (user) {
      const payload: JwtPayload = { login };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Please check your login credentials.");
    }
  }
}
