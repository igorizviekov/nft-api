import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  @ApiProperty({
    type: String,
    description: "User wallet address",
    required: true,
  })
  wallet: string;

  @IsString()
  @ApiProperty({
    type: String,
    description:
      "Blockchain id (e.g., Polygon mainnet, Polygon testnet, Shimmer mainnet, Shimmer testnet)",
    required: true,
  })
  blockchain_id: string;

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
