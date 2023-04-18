import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.entity";
import { AuthUserDto } from "./dto/auth-user.dto";

@EntityRepository(User)
export class UsersRepository extends Repository<UserDto> {
  async getUsers(
    search: string,
    limit: number,
    offset: number
  ): Promise<UserDto[]> {
    const query = this.createQueryBuilder("user");

    if (search) {
      query.andWhere("(LOWER(user.wallet) LIKE LOWER(:search))", {
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

    query.select([
      "user.id",
      "user.wallet",
      "user.discord",
      "user.email",
      "user.location",
      "user.website",
      "user.name",
    ]);

    const users = await query.getMany();
    return users;
  }

  async createUser(userData: AuthUserDto): Promise<UserDto> {
    const { wallet } = userData;

    const user: UserDto = this.create({
      wallet,
    });

    try {
      await this.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return user;
  }
}
