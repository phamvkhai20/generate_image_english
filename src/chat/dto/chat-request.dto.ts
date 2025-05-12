import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Nội dung prompt để gửi đến Groq AI',
    example: 'Tiếng Việt: Tôi đi bộ vào buổi sáng. Tiếng Anh: I walk in the morning.',
    required: true
  })
  prompt: string;
}