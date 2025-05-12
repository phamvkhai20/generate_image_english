import { ApiProperty } from '@nestjs/swagger';

class CorrectionDto {
  @ApiProperty({ description: 'Mô tả lỗi' })
  issue: string;

  @ApiProperty({ description: 'Giải thích lý do lỗi' })
  explanation: string;

  @ApiProperty({ description: 'Gợi ý sửa lỗi' })
  suggestion: string;
}

class ChatContentDto {
  @ApiProperty({ description: 'Bản dịch có chính xác không', example: true })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Phản hồi ngắn gọn về bản dịch',
    example: 'Bản dịch chính xác và tự nhiên.',
  })
  feedback: string;

  @ApiProperty({
    description: 'Danh sách các lỗi và gợi ý sửa',
    type: [CorrectionDto],
  })
  corrections: CorrectionDto[];

  @ApiProperty({ description: 'Các bản dịch thay thế', type: [String] })
  suggestions: string[];

  @ApiProperty({
    description: 'Bản dịch đúng hoặc null nếu sai',
    example: 'I walk in the morning.',
  })
  confirmedTranslation: string;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'Trạng thái thành công', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Nội dung phản hồi từ Groq',
    type: ChatContentDto,
  })
  content: ChatContentDto;

  @ApiProperty({
    description: 'Model AI được sử dụng',
    example: 'llama-3.3-70b-versatile',
  })
  model: string;

  @ApiProperty({
    description: 'Thông tin sử dụng token',
    example: {
      total_tokens: 293,
      prompt_tokens: 245,
      completion_tokens: 48,
    },
  })
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };

  @ApiProperty({
    description: 'ID của phiên chat',
    example: 'chatcmpl-33138ac9-29b3-400c-8ef0-d330bea08696',
  })
  id: string;
}
