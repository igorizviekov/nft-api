import { ApiProperty } from "@nestjs/swagger";

export class AddMintRequestDto {
  @ApiProperty()
  requestId: number;
}
