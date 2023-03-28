"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
class UsersRepository extends typeorm_1.Repository {
    async getUsers(search, limit, offset) {
        const query = this.createQueryBuilder("user");
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
    async createUser(userData) {
        const { login, email } = userData;
        const user = this.create({
            login,
            email,
        });
        try {
            await this.save(user);
        }
        catch (e) {
            if (e.code === "23505") {
                throw new common_1.ConflictException("This user already exists");
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
        return user;
    }
}
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map