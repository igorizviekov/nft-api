import { UserDto } from "./dto/user.dto";
import { FilterUsersDto } from "./dto/filter-users.dto";
import { UsersService } from "./users.service";
import { AuthUserDto } from "./dto/auth-user.dto";
import { IResponse } from "src/app.types";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAll(query: FilterUsersDto): Promise<IResponse>;
    getById(id: string): Promise<IResponse>;
    signIn(userDto: UserDto): Promise<IResponse>;
    update(body: AuthUserDto, id: string): Promise<IResponse>;
    remove(id: string): Promise<IResponse>;
}
