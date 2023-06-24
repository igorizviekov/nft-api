import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from "class-validator";
import { CollectionCategory } from "../collection.enum";

export class UpdateCollectionDto {
  @ApiProperty({ description: "Collection title" })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: "Short symbol, f.e. PHO" })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({ description: "mapping to the Blockchain DB" })
  @IsUUID()
  @IsOptional()
  blockchain_id: string;

  @ApiProperty({
    description: "Primary Collection category",
    enum: CollectionCategory,
  })
  @IsEnum(CollectionCategory)
  @IsOptional()
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

  @ApiProperty({ description: "Uploaded NFTs to IPFS", required: false })
  @IsOptional()
  nfts?: string[];

  @ApiProperty({ description: "Collection image", required: false })
  @IsUrl()
  @IsOptional()
  image: string;
}
