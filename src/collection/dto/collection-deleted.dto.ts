import { ApiProperty } from "@nestjs/swagger";

export class DeletedCollectionDto {
  @ApiProperty({ type: String, description: "Success message" })
  status: string;
}
