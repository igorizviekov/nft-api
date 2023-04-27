import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { CollectionCategory } from "../collection.enum";

export class CollectionDto {
  @ApiProperty({ description: "Collection name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Short symbol" })
  @IsString()
  symbol: string;

  @ApiProperty({ description: "Blockchain ID" })
  @IsUUID()
  blockchain_id: string;

  @ApiProperty({
    description: "Primary Collection category",
    enum: CollectionCategory,
  })
  @IsEnum(CollectionCategory)
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
  @IsString()
  website?: string;

  @ApiProperty({ description: "Royalties percentage", required: false })
  @IsOptional()
  @IsString()
  royalties?: string;

  @ApiProperty({ description: "Collection image", required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
