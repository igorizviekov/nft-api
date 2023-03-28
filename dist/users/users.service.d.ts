import { IResponse } from "src/app.types";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
export declare class UsersService {
    private usersRepo;
    constructor(usersRepo: UsersRepository);
    getUsers(search: string, limit: number, offset: number): Promise<IResponse>;
    getById(id: string): Promise<IResponse>;
    signIn(credentials: UserDto): Promise<IResponse>;
}
