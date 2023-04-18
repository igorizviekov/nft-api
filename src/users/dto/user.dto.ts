import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class UserDto {
  @ApiProperty({ type: String, description: "User id", required: false })
  id: string;

  @IsOptional()
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  @ApiProperty({
    type: String,
    description: "User wallet address",
    required: false,
  })
  wallet: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: "User email",
    required: false,
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: "User address",
    required: false,
  })
  location: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: "User name",
    required: false,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: "User Discord",
    required: false,
  })
  discord: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    type: String,
    description: "User website",
    required: false,
  })
  website: string;
}
