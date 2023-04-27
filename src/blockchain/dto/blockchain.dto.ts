import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BlockchainDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: "Blockchain id (e.g., 1071 / 137)",
    required: true,
  })
  chain_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Blockchain token symbol (e.g., ETH / MATIC)",
    required: true,
  })
  currency_symbol: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "rpc URL",
    required: true,
  })
  rpc_url: string;
}
