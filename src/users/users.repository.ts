import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository, Brackets } from "typeorm";
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

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("LOWER(user.name) LIKE LOWER(:search)")
            .orWhere("LOWER(user.email) LIKE LOWER(:search)")
            .orWhere("LOWER(user.location) LIKE LOWER(:search)")
            .orWhere("LOWER(user.discord) LIKE LOWER(:search)")
            .orWhere("LOWER(user.website) LIKE LOWER(:search)");
        }),
        { search: `%${search}%` }
      );
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
      "user.discord",
      "user.email",
      "user.location",
      "user.website",
      "user.name",
    ]);

    const users = await query.getMany();
    return users;
  }

  async createUser(userData: UserDto): Promise<UserDto> {
    const user: UserDto = this.create(userData);
    try {
      await this.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return user;
  }
}
