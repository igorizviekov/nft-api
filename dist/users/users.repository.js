"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const bcrypt = require("bcrypt");
let UsersRepository = class UsersRepository extends typeorm_1.Repository {
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
        query.select(["user.id", "user.login"]);
        const users = await query.getMany();
        return users;
    }
    async createUser(userData) {
        const { login, password } = userData;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({
            login,
            password: hashedPassword,
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
};
UsersRepository = __decorate([
    (0, typeorm_1.EntityRepository)(users_entity_1.User)
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.repository.js.map