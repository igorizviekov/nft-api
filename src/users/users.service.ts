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
import { IResponse } from "src/app.types";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
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
      const match = await this.usersRepo.findOne(id, {
        select: ["id", "login"],
      });
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return { status: "success", data: match };
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async signUp(userDto: UserDto): Promise<IResponse> {
    const newUser = await this.usersRepo.createUser(userDto);
    return { status: "success", data: newUser };
  }

  async signIn(creadentials: UserDto): Promise<IResponse> {
    const { login, password } = creadentials;

    const user = await this.usersRepo.findOne({ login });
    //if user exist in db, sign a jwt token
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { login };
      const accessToken: string = this.jwtService.sign(payload);
      return { status: "success", data: { accessToken } };
    } else {
      throw new UnauthorizedException("Please check your login credentials.");
    }
  }

  async update(id: string, UserToUpdate: AuthUserDto): Promise<IResponse> {
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
