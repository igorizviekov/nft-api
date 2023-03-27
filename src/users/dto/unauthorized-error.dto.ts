import { ApiProperty } from "@nestjs/swagger";

export class NotAuthorizedDto {
  @ApiProperty({ type: Number, default: 401 })
  statusCode: number;

  @ApiProperty({
    type: String,
  })
  message: string;
}
