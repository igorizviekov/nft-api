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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const filter_users_dto_1 = require("./dto/filter-users.dto");
const users_service_1 = require("./users.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const auth_user_dto_1 = require("./dto/auth-user.dto");
const user_deleted_dto_1 = require("./dto/user-deleted.dto");
const user_notFoundError_dto_1 = require("./dto/user-notFoundError.dto");
const unauthorized_error_dto_1 = require("./dto/unauthorized-error.dto");
const signin_dto_1 = require("./dto/signin.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAll(query) {
        const { search, limit, offset } = query;
        return this.usersService.getUsers(search, Number(limit), Number(offset));
    }
    getById(id) {
        return this.usersService.getById(id);
    }
    signIn(userDto) {
        return this.usersService.signIn(userDto);
    }
    update(body, id) {
        return this.usersService.update(id, body);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        description: "User records",
        isArray: true,
        type: user_dto_1.UserDto,
        status: 200,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_users_dto_1.FilterUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Get by id",
        isArray: false,
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User does not exist",
        type: user_notFoundError_dto_1.NotFoundDto,
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)("/signin"),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "User signed in successfully",
        type: signin_dto_1.SignInDto,
    }),
    (0, swagger_1.ApiBody)({ type: auth_user_dto_1.AuthUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signIn", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Patch)("/:id"),
    (0, swagger_1.ApiOkResponse)({
        description: "User updated successfully",
        isArray: false,
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiBody)({ type: auth_user_dto_1.AuthUserDto }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User does not exist",
        type: user_notFoundError_dto_1.NotFoundDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentails",
        type: unauthorized_error_dto_1.NotAuthorizedDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_user_dto_1.AuthUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Delete)("/:id"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User Deleted",
        isArray: false,
        type: user_deleted_dto_1.DeletedUserDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Invalid credentails",
        type: unauthorized_error_dto_1.NotAuthorizedDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User does not exist",
        type: user_notFoundError_dto_1.NotFoundDto,
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, swagger_1.ApiTags)("Users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map