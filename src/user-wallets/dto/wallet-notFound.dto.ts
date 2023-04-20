import { ApiProperty } from "@nestjs/swagger";

export class WalletNotFoundDto {
  @ApiProperty({ type: Number, default: 404 })
  statusCode: number;

  @ApiProperty({
    type: String,
  })
  error: string;

  @ApiProperty({
    type: String,
  })
  message: string;
}
