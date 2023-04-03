import { ApiProperty } from "@nestjs/swagger";

export class WeakPasswordDto {
  @ApiProperty({ type: Number, default: 400 })
  statusCode: number;

  @ApiProperty({
    type: Array,
  })
  message: [];

  @ApiProperty({
    type: String,
    default: "Bad request",
  })
  error: string;
}
