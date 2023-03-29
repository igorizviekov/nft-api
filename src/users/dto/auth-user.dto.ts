import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ type: String, description: 'User login', required: true })
  login: string;

  @ApiProperty({ type: String, description: 'User password', required: true })
  password: string;
}
