import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "../nft-logs.enum";

export class NftLogsDto {
  @ApiProperty({ description: "Image URI of the NFT" })
  @IsNotEmpty()
  @IsString()
  image_uri: string;

  @ApiProperty({ description: "Id of the NFT" })
  @IsNotEmpty()
  @IsString()
  nft_id: string;

  @ApiProperty({
    description: "Type of the transaction (listing, sale, or delisting)",
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @ApiProperty({
    description: "Seller wallet address (optional)",
    required: false,
  })
  @IsOptional()
  @IsString()
  seller_address?: string;

  @ApiProperty({
    description: "Buyer wallet address (optional)",
    required: false,
  })
  @IsOptional()
  @IsString()
  buyer_address?: string;

  @ApiProperty({ description: "Token value of the NFT" })
  @IsNotEmpty()
  @IsString()
  token_value: string;

  @ApiProperty({ description: "Date of the transaction" })
  @IsNotEmpty()
  @IsString()
  date: string;
}
