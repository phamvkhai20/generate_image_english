import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({
    description: 'Tiêu đề của nội dung',
    example: 'Vai trò của mạng xã hội',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Nội dung đầy đủ, sẽ được tách thành các câu',
    example:
      'Ngày nay, mạng xã hội đóng vai trò quan trọng trong cuộc sống hàng ngày của chúng ta. Nhiều người sử dụng các nền tảng như Facebook, Instagram, và TikTok để giữ liên lạc với bạn bè và gia đình.',
    required: true,
  })
  content: string;
}
