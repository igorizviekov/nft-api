import { ApiProperty } from "@nestjs/swagger";

export class DeletedChainDto {
  @ApiProperty({ type: String, description: "Success message" })
  result: string;

  @ApiProperty({
    type: String,
    description: "Number of entries affected. Must be 1",
  })
  affected: string;
}
