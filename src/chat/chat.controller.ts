import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatRequestDto } from './dto/chat-request.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('groq')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Chat với Groq AI',
    description:
      'Gửi prompt đến Groq AI để kiểm tra bản dịch tiếng Anh. Yêu cầu xác thực JWT.',
  })
  @ApiBody({
    type: ChatRequestDto,
    description: 'Prompt để gửi đến Groq AI',
    examples: {
      example1: {
        value: {
          prompt:
            'Tiếng Việt: Tôi đi bộ vào buổi sáng. Tiếng Anh: I walk in the morning.',
        },
        summary: 'Ví dụ kiểm tra bản dịch',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Phản hồi thành công từ Groq AI',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không được phép - Yêu cầu xác thực',
  })
  async chatWithGroq(@Body() chatRequestDto: ChatRequestDto, @Request() req) {
    return this.chatService.chatWithGroq(chatRequestDto.prompt);
  }
}
