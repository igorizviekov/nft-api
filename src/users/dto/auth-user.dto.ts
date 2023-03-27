import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({ type: String, description: "User login", required: true })
  login: string;
}
