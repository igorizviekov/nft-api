import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UserDto {
  @ApiProperty({ type: String, description: "User id", required: false })
  id: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ type: String, description: "User login", required: true })
  login: string;
}
