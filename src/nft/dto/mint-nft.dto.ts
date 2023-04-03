import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class MintNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Nft description",
    required: true,
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "Nft title", required: true })
  name: string;

  @ApiProperty({ type: Number, description: "NFT price", required: true })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: "string", format: "binary" })
  @Transform(({ value }) =>
    value ? Buffer.from(new Uint8Array(value.buffer)) : null
  )
  file: Buffer;
}
