import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBlockchainDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    description: "Blockchain id (e.g., 1071 / 137)",
    required: true,
  })
  chain_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: "Blockchain token symbol (e.g., ETH / MATIC)",
    required: true,
  })
  currency_symbol: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: "rpc URL",
    required: true,
  })
  rpc_url: string;
}
