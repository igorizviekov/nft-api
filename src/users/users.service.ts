import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { JwtService } from "@nestjs/jwt";
import { In } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    private jwtService: JwtService
  ) {}

  getUsers(search: string, limit: number, offset: number): Promise<UserDto[]> {
    return this.usersRepo.getUsers(search, limit, offset);
  }

  async getById(id: string): Promise<UserDto> {
    try {
      const match = await this.usersRepo.findBy({ id: In([id]) });
      if (!match.length) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return match[0];
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async signIn(credentials: UserDto): Promise<{ status: string } | UserDto> {
    const { login, token, id } = credentials;
    await this.jwtService.verify(token);
    const user = await this.usersRepo.findBy({ login: In([login]) });
    //if user exist in db
    if (user.length > 0) {
      return { status: "Success" };
    } else {
      return this.usersRepo.createUser({ login, id, token });
    }
  }
}
