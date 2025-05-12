import {
  Injectable,
  Inject,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import axios from 'axios';
import { UsersService } from '../users/users.service';

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    queue_time: number;
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
  };
  usage_breakdown: {
    models: any;
  };
  system_fingerprint: string;
  x_groq: {
    id: string;
  };
}

@Injectable()
export class ChatService {
  constructor(
    private readonly usersService: UsersService,
    @Optional() @Inject(REQUEST) private readonly request: Request,
  ) {}

  async chatWithGroq(prompt: string): Promise<any> {
    try {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (!this.request || !this.request.user) {
        throw new UnauthorizedException(
          'Bạn cần đăng nhập để sử dụng chức năng chat',
        );
      }

      // Lấy API key từ người dùng hiện tại
      let apiKey = process.env.GROQ_API_KEY; // API key mặc định

      const userId = this.request.user.userId;
      const userApiKey = await this.usersService.findApiKeyByUserId(
        userId,
        'groq',
      );

      if (userApiKey) {
        apiKey = userApiKey.key; // Sử dụng API key của người dùng
      }

      if (!apiKey) {
        throw new Error('GROQ_API_KEY không được cấu hình');
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'Bạn là một giáo viên tiếng Anh nghiêm khắc, chuyên đánh giá các bản dịch từ tiếng Việt sang tiếng Anh. Hãy kiểm tra cẩn thận từng thành phần trong câu dịch: nghĩa, thì, ngữ pháp, sắc thái (ví dụ: tần suất như thường, cảm xúc, mức độ...). Không được bỏ sót bất kỳ thông tin nào. Hãy phản hồi bằng một đối tượng JSON theo cấu trúc sau: \n\n{ \n  "isCorrect": (true/false), \n   "score": số nguyên từ 0 đến 10 (đánh giá độ chính xác của bản dịch), \n "feedback": { \n      "issue": "...mô tả lỗi...", \n      "explanation": "...vì sao sai...", \n      "suggestion": "...gợi ý câu tiếng anh đúng ..." \n    }, \n   "suggestions": ["...câu gợi ý câu tiếng anh khác nếu có..."], \n  "confirmedTranslation": "...bản dịch nếu đúng, hoặc null nếu sai..." \n} \n\nNếu bản dịch đúng, phần corrections và suggestions để trống, confirmedTranslation là câu gốc.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      return this.processGroqResponse(response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API Groq:', error.message);
      return {
        success: false,
        error: error.message,
        message: 'Đã xảy ra lỗi khi gọi API Groq',
      };
    }
  }

  processGroqResponse(response: GroqResponse): any {
    try {
      // Kiểm tra xem phản hồi có đúng định dạng không
      if (
        !response ||
        !response.choices ||
        !response.choices.length ||
        !response.choices[0].message
      ) {
        throw new Error('Phản hồi từ API Groq không hợp lệ');
      }

      // Trích xuất nội dung từ phản hồi
      const content = response.choices[0].message.content;

      // Phân tích chuỗi JSON trong content thành đối tượng JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        console.error('Lỗi khi phân tích nội dung JSON:', parseError.message);
        parsedContent = content; // Nếu không phân tích được, giữ nguyên chuỗi
      }

      // Trả về kết quả đã xử lý
      return {
        success: true,
        content: parsedContent, // Trả về đối tượng JSON đã phân tích thay vì chuỗi
      };
    } catch (error) {
      console.error('Lỗi khi xử lý phản hồi từ API Groq:', error.message);
      return {
        success: false,
        error: error.message,
        message: 'Đã xảy ra lỗi khi xử lý phản hồi từ API Groq',
      };
    }
  }
}
