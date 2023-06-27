import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  usersUID: string;
}
