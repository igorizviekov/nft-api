import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class MintNftDto {
  @ApiProperty({
    description: "Nft metadata",
  })
  metadata: string;

  @ApiProperty({ type: Number, description: "NFT price", required: true })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: "string", format: "binary" })
  @Transform(({ value }) =>
    value ? Buffer.from(new Uint8Array(value.buffer)) : null
  )
  file: Buffer;
}
