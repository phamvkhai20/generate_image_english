import { ApiProperty } from '@nestjs/swagger';
import { SentenceDto } from './sentence.dto';

export class ContentResponseDto {
  @ApiProperty({
    description: 'ID của nội dung',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Tiêu đề của nội dung',
    example: 'Vai trò của mạng xã hội',
  })
  title: string;

  @ApiProperty({
    description: 'Danh sách các câu đã được tách',
    example: [
      'Ngày nay, mạng xã hội đóng vai trò quan trọng trong cuộc sống hàng ngày của chúng ta.',
      'Nhiều người sử dụng các nền tảng như Facebook, Instagram, và TikTok để giữ liên lạc với bạn bè và gia đình.',
      'Nhờ mạng xã hội, chúng ta có thể chia sẻ suy nghĩ, hình ảnh và những khoảnh khắc đáng nhớ với người thân dù ở xa.',
    ],
  })
  sentences: string[];

  @ApiProperty({
    description: 'Danh sách các câu chi tiết',
    type: [SentenceDto],
  })
  sentencesList: SentenceDto[];

  @ApiProperty({
    description: 'Nội dung đầy đủ',
    example:
      'Ngày nay, mạng xã hội đóng vai trò quan trọng trong cuộc sống hàng ngày của chúng ta. Nhiều người sử dụng các nền tảng như Facebook, Instagram, và TikTok để giữ liên lạc với bạn bè và gia đình. Nhờ mạng xã hội, chúng ta có thể chia sẻ suy nghĩ, hình ảnh và những khoảnh khắc đáng nhớ với người thân dù ở xa.',
  })
  fullContent: string;

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
