import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserDto {
  @ApiProperty({ type: String, description: "User id", required: false })
  id: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ type: String, description: "User login", required: true })
  login: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is too weak.",
  })
  @ApiProperty({ type: String, description: "User password", required: true })
  password: string;
}
