import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BlockchainDto {
  @IsOptional()
  @ApiProperty({ type: String, description: "Blockchain id", required: false })
  id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: "Blockchain name",
    required: true,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description:
      "Blockchain id (e.g., Polygon mainnet, Polygon testnet, Shimmer mainnet, Shimmer testnet)",
    required: false,
  })
  network_id: string;
}
