import {
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<UserDto> {
  async getUsers(
    search: string,
    limit: number,
    offset: number
  ): Promise<UserDto[]> {
    const query = this.createQueryBuilder("user");
    //TODO: extend search parameters
    if (search) {
      query.andWhere("(LOWER(user.login) LIKE LOWER(:search))", {
        search: `%${search}%`,
      });
    }

    if (limit) {
      limit = (limit || 30) && limit > 100 ? 100 : limit;
      query.limit(limit);
    }
    if (offset) {
      offset = offset ? offset : 0;
      query.offset(offset);
    }

    query.select(["user.id", "user.login"]);

    const users = await query.getMany();
    return users;
  }

  async createUser(userData: UserDto): Promise<UserDto> {
    const { login, password } = userData;

    //hash user password (salt + user input)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: UserDto = this.create({
      login,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (e) {
      //duplicate record
      if (e.code === "23505") {
        throw new ConflictException("This user already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
