import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.entity";
export declare class UsersRepository extends Repository<User> {
    getUsers(search: string, limit: number, offset: number): Promise<UserDto[]>;
    createUser(userData: UserDto): Promise<UserDto>;
}
