import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository
  ) {}

  async getUsers(
    search: string,
    limit: number,
    offset: number
  ): Promise<IResponse> {
    const match = await this.usersRepo.getUsers(search, limit, offset);
    return { status: "existing", records: match };
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.usersRepo.findOne({ where: { id } });
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return { status: "existing", record: match };
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  // create a new user record or return existing record
  async signIn(credentials: UserDto): Promise<IResponse> {
    const { login, token } = credentials;
    const user = await this.usersRepo.findOne({ where: { login } });
    if (user) {
      return { status: "existing", record: user };
    } else {
      const newUser = await this.usersRepo.createUser({ login, token });
      return { status: "new record created", record: newUser };
    }
  }
}
