"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_repository_1 = require("./users.repository");
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(usersRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
    }
    async getUsers(search, limit, offset) {
        const users = await this.usersRepo.getUsers(search, limit, offset);
        return { status: "success", data: users };
    }
    async getById(id) {
        try {
            const match = await this.usersRepo.findOne(id, {
                select: ["id", "wallet"],
            });
            if (!match) {
                throw new common_1.NotFoundException(`User with id ${id} not found.`);
            }
            return { status: "success", data: match };
        }
        catch (e) {
            throw new common_1.NotFoundException(`User with id ${id} not found.`);
        }
    }
    async signUp(userDto) {
        const newUser = await this.usersRepo.createUser(userDto);
        return { status: "success", data: newUser };
    }
    async signIn(credentials) {
        const { wallet } = credentials;
        const user = await this.usersRepo.findOne({ wallet });
        if (user) {
            const payload = { wallet };
            const accessToken = this.jwtService.sign(payload);
            return { status: "success", data: { accessToken } };
        }
        else {
            throw new common_1.UnauthorizedException("Please check your login credentials.");
        }
    }
    async update(id, UserToUpdate) {
        const { data } = await this.getById(id);
        Object.keys(UserToUpdate).forEach((key) => {
            data[key] = UserToUpdate[key];
        });
        await this.usersRepo.update(id, data);
        return { status: "success", data };
    }
    async remove(id) {
        try {
            const res = await this.usersRepo.delete(id);
            if (res.affected === 0) {
                throw new common_1.NotFoundException(`User with ${id} not found.`);
            }
            return {
                status: "delete success",
            };
        }
        catch (e) {
            throw new common_1.NotFoundException(`User with ${id} not found.`);
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map