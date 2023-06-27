import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class UserDto {
  @ApiProperty({ type: String, description: "User id", required: false })
  id: string;

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

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description:
      "Flag which indicates that user approved marketplace contract top transfer tokens",
    required: false,
  })
  isApprovedMarketplace?: boolean;
  @IsUrl()
  @ApiProperty({
    type: String,
    description: "User image",
    required: false,
  })
  image: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    type: String,
    description: "User twitter",
    required: false,
  })
  twitter: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    type: String,
    description: "User instagram",
    required: false,
  })
  instagram: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    type: String,
    description: "User description",
    required: false,
  })
  description: string;
}
