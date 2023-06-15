import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from "class-validator";
import { CollectionCategory, CollectionRoyalties } from "../collection.enum";

export class CollectionDto {
  @ApiProperty({ description: "Collection title" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Short symbol, f.e. PHO" })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ description: "mapping to the Blockchain DB" })
  @IsUUID()
  @IsNotEmpty()
  blockchain_id: string;

  @ApiProperty({
    description: "Primary Collection category",
    enum: CollectionCategory,
  })
  @IsEnum(CollectionCategory)
  @IsNotEmpty()
  categoryPrimary: CollectionCategory;

  @ApiProperty({
    description: "Secondary Collection category",
    enum: CollectionCategory,
  })
  @IsOptional()
  @IsEnum(CollectionCategory)
  categorySecondary?: CollectionCategory;

  @ApiProperty({ description: "Collection description", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Collection website", required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: "Collection image", required: false })
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ description: "Royalties percentage", required: false })
  @IsOptional()
  @IsNumber()
  royalties?: CollectionRoyalties;
}
