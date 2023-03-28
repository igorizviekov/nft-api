import { IResponse } from "src/app.types";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { OAuth2Client } from "google-auth-library";
import { ConfigService } from "@nestjs/config";
export declare class UsersService {
    private usersRepo;
    private readonly configService;
    private readonly oAuth2Client;
    private readonly googleID;
    constructor(usersRepo: UsersRepository, configService: ConfigService, oAuth2Client: OAuth2Client);
    getUsers(search: string, limit: number, offset: number): Promise<IResponse>;
    getById(id: string): Promise<IResponse>;
    signIn(credentials: UserDto): Promise<IResponse>;
}
