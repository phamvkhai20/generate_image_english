import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

// DTO cho đăng nhập
class LoginDto {
  username: string;
  password: string;
}

// DTO cho đăng ký
class SignupDto {
  username: string;
  email: string;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      example1: {
        value: {
          username: 'user1',
          password: 'password123'
        },
        summary: 'Ví dụ đăng nhập'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Đăng nhập thất bại' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiBody({
    type: SignupDto,
    description: 'Thông tin đăng ký',
    examples: {
      example1: {
        value: {
          username: 'newuser',
          email: 'user@example.com',
          password: 'password123'
        },
        summary: 'Ví dụ đăng ký'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body.username, body.email, body.password);
  }
}