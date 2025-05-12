import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsOptional, Min } from 'class-validator';

export class CreateCreditDto {
  @ApiProperty({
    description: 'Số tiền giao dịch',
    example: 50.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Loại giao dịch',
    enum: ['deposit', 'withdraw', 'usage'],
    example: 'deposit'
  })
  @IsEnum(['deposit', 'withdraw', 'usage'])
  type: 'deposit' | 'withdraw' | 'usage';

  @ApiProperty({
    description: 'Mô tả giao dịch',
    example: 'Nạp tiền vào tài khoản',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}