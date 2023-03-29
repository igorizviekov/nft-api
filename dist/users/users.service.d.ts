import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { JwtService } from "@nestjs/jwt";
import { AuthUserDto } from "./dto/auth-user.dto";
import { IResponse } from "src/app.types";
export declare class UsersService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: UsersRepository, jwtService: JwtService);
    getUsers(search: string, limit: number, offset: number): Promise<IResponse>;
    getById(id: string): Promise<IResponse>;
    signUp(userDto: UserDto): Promise<IResponse>;
    signIn(creadentials: UserDto): Promise<IResponse>;
    update(id: string, UserToUpdate: AuthUserDto): Promise<IResponse>;
    remove(id: string): Promise<IResponse>;
}
