import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IResponse } from "src/app.types";
import { UserDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { OAuth2Client } from "google-auth-library";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  private readonly googleID: string;

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    private readonly configService: ConfigService,
    private readonly oAuth2Client: OAuth2Client
  ) {
    this.oAuth2Client = new OAuth2Client(
      this.configService.get("GOOGLE_CLIENT_ID")
    );
  }

  async getUsers(
    search: string,
    limit: number,
    offset: number
  ): Promise<IResponse> {
    const match = await this.usersRepo.getUsers(search, limit, offset);
    return { status: "existing", records: match };
  }

  async getById(id: string): Promise<IResponse> {
    try {
      const match = await this.usersRepo.findOne({ where: { id } });
      if (!match) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return { status: "existing", record: match };
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  // create a new user record or return existing record
  async signIn(credentials: UserDto): Promise<IResponse> {
    const { login, token } = credentials;

    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: token,
      audience: this.googleID,
    });

    const payload = ticket.getPayload();

    if (payload === undefined) {
      throw new NotFoundException(
        `User with login ${login} not found in the Google OAuth2`
      );
    }
    const { email } = payload;

    const user = await this.usersRepo.findOne({ where: { email } });
    if (user) {
      return { status: "existing", record: user };
    } else {
      const newUser = await this.usersRepo.createUser({ login, email });
      return { status: "new record created", record: newUser };
    }
  }
}
