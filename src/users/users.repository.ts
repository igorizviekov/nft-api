import {
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.entity";

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

    const users = await query.getMany();
    return users;
  }

  async createUser(userData: UserDto): Promise<UserDto> {
    const { login } = userData;

    const user: UserDto = this.create({
      login,
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
