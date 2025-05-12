import { ApiProperty } from '@nestjs/swagger';

export class SentenceDto {
  @ApiProperty({
    description: 'ID của câu',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nội dung của câu',
    example: 'Ngày nay, mạng xã hội đóng vai trò quan trọng trong cuộc sống hàng ngày của chúng ta.',
  })
  text: string;

  @ApiProperty({
    description: 'Thứ tự của câu trong nội dung',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'ID của nội dung chứa câu này',
    example: 1,
  })
  contentId: number;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2023-08-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    example: '2023-08-15T10:30:00Z',
  })
  updatedAt: Date;
}