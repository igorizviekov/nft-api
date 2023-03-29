import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Search by login',
    required: false,
  })
  search: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'Record limit', required: false })
  limit: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'Record offset', required: false })
  offset: number;
}
