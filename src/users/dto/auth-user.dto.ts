import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({ type: String, description: "User wallet", required: true })
  wallet: string;
}
