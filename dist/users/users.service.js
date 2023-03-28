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
let UsersService = class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async getUsers(search, limit, offset) {
        const match = await this.usersRepo.getUsers(search, limit, offset);
        return { status: "existing", records: match };
    }
    async getById(id) {
        try {
            const match = await this.usersRepo.findOne({ where: { id } });
            if (!match) {
                throw new common_1.NotFoundException(`User with id ${id} not found.`);
            }
            return { status: "existing", record: match };
        }
        catch (e) {
            throw new common_1.NotFoundException(`User with id ${id} not found.`);
        }
    }
    async signIn(credentials) {
        const { login, token } = credentials;
        const user = await this.usersRepo.findOne({ where: { login } });
        if (user) {
            return { status: "existing", record: user };
        }
        else {
            const newUser = await this.usersRepo.createUser({ login, token });
            return { status: "new record created", record: newUser };
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map