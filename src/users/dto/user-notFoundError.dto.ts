import { ApiProperty } from '@nestjs/swagger';

export class NotFoundDto {
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
