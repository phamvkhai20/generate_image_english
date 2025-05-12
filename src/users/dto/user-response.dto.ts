import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID của người dùng',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'johndoe'
  })
  username: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'john@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Thời gian tạo tài khoản',
    example: '2023-08-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    example: '2023-08-15T10:30:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Tên đầy đủ của người dùng',
    example: 'John Doe',
    required: false
  })
  fullName: string;

  @ApiProperty({
    description: 'URL ảnh đại diện của người dùng',
    example: 'https://example.com/avatar.jpg',
    required: false
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'Số credits hiện tại của người dùng',
    example: 100
  })
  credits: number;
}