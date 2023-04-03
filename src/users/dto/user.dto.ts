import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class UserDto {
  @ApiProperty({ type: String, description: "User id", required: false })
  id: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  @ApiProperty({
    type: String,
    description: "User wallet address",
    required: true,
  })
  wallet: string;
}
