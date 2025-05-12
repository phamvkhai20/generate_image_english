import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'johndoe',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'john@example.com',
    required: true
  })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'password123',
    required: true
  })
  password: string;
}