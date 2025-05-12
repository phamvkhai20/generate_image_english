import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './enums/role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { CreditsService } from 'src/credits/credits.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly creditsService: CreditsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lấy thông tin profile của người dùng',
    description: 'Trả về thông tin chi tiết của người dùng hiện tại bao gồm credits',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin profile người dùng',
    type: UserResponseDto,
  })
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    const credits = await this.creditsService.getCurrentBalance(userId);

    return {
      ...user,
      credits,
    };
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cập nhật role của người dùng (Chỉ Admin)',
    description: 'Cập nhật role của người dùng. Yêu cầu quyền Admin.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: [Role.USER, Role.ADMIN],
          description: 'Role mới của người dùng',
        },
      },
    },
    examples: {
      example1: {
        value: {
          role: 'admin',
        },
        summary: 'Cấp quyền Admin',
      },
      example2: {
        value: {
          role: 'user',
        },
        summary: 'Đặt lại quyền User',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role đã được cập nhật thành công',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không được phép - Yêu cầu xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Cấm - Không có quyền Admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(+id, role);
  }
}
