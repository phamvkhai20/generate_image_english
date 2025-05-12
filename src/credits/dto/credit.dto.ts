import { ApiProperty } from '@nestjs/swagger';

export class CreditDto {
  @ApiProperty({
    description: 'ID của giao dịch credit',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'ID của người dùng',
    example: 1
  })
  userId: number;

  @ApiProperty({
    description: 'Số dư hiện tại',
    example: 100.00
  })
  balance: number;

  @ApiProperty({
    description: 'Số tiền giao dịch',
    example: 50.00
  })
  amount: number;

  @ApiProperty({
    description: 'Loại giao dịch',
    enum: ['deposit', 'withdraw', 'usage'],
    example: 'deposit'
  })
  type: 'deposit' | 'withdraw' | 'usage';

  @ApiProperty({
    description: 'Mô tả giao dịch',
    example: 'Nạp tiền vào tài khoản'
  })
  description: string;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-20T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-20T10:30:00Z'
  })
  updatedAt: Date;
}