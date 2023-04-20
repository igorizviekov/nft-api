import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class WalletDto {
  @IsOptional()
  @ApiProperty({ type: String, description: "Wallet id", required: false })
  id: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: "User id",
    required: true,
  })
  user_id: string;

  @IsString()
  @ApiProperty({
    type: String,
    description:
      "Blockchain id (e.g., Polygon mainnet, Polygon testnet, Shimmer mainnet, Shimmer testnet)",
    required: true,
  })
  blockchain_id: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  @ApiProperty({
    type: String,
    description: "Wallet address",
    required: true,
  })
  wallet_address: string;
}
