import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
export declare class UsersRepository extends Repository<UserDto> {
    getUsers(search: string, limit: number, offset: number): Promise<UserDto[]>;
    createUser(userData: UserDto): Promise<UserDto>;
}
