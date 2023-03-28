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
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("@nestjs/config");
let UsersService = class UsersService {
    constructor(usersRepo, configService, oAuth2Client) {
        this.usersRepo = usersRepo;
        this.configService = configService;
        this.oAuth2Client = oAuth2Client;
        this.oAuth2Client = new google_auth_library_1.OAuth2Client(this.configService.get("GOOGLE_CLIENT_ID"));
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
        const ticket = await this.oAuth2Client.verifyIdToken({
            idToken: token,
            audience: this.googleID,
        });
        const payload = ticket.getPayload();
        if (payload === undefined) {
            throw new common_1.NotFoundException(`User with login ${login} not found in the Google OAuth2`);
        }
        const { email } = payload;
        const user = await this.usersRepo.findOne({ where: { email } });
        if (user) {
            return { status: "existing", record: user };
        }
        else {
            const newUser = await this.usersRepo.createUser({ login, email });
            return { status: "new record created", record: newUser };
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_repository_1.UsersRepository)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        config_1.ConfigService,
        google_auth_library_1.OAuth2Client])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map