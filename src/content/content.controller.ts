import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { Content } from './entities/content.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentResponseDto } from './dto/content-response.dto';

@ApiTags('content')
@Controller('content')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Tạo nội dung mới (Chỉ Admin)',
    description: 'Tạo nội dung mới với tiêu đề và nội dung, tự động tách thành các câu. Yêu cầu quyền Admin.'
  })
  @ApiBody({ 
    type: CreateContentDto,
    description: 'Thông tin nội dung cần tạo',
    examples: {
      example1: {
        value: {
          title: 'Vai trò của mạng xã hội',
          content: 'Ngày nay, mạng xã hội đóng vai trò quan trọng trong cuộc sống hàng ngày của chúng ta. Nhiều người sử dụng các nền tảng như Facebook, Instagram, và TikTok để giữ liên lạc với bạn bè và gia đình.'
        },
        summary: 'Ví dụ tạo nội dung'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Nội dung đã được tạo thành công',
    type: ContentResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không được phép - Yêu cầu xác thực' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Cấm - Không có quyền Admin' 
  })
  async create(@Body() createContentDto: CreateContentDto): Promise<Content> {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Lấy tất cả nội dung',
    description: 'Lấy danh sách tất cả nội dung đã lưu. Yêu cầu xác thực JWT.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách nội dung',
    type: [ContentResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không được phép - Yêu cầu xác thực' 
  })
  async findAll(): Promise<Content[]> {
    return this.contentService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ 
    summary: 'Lấy nội dung theo ID',
    description: 'Lấy thông tin chi tiết của một nội dung theo ID. Yêu cầu xác thực JWT.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin nội dung',
    type: ContentResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không được phép - Yêu cầu xác thực' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy nội dung' 
  })
  async findOne(@Param('id') id: string): Promise<Content> {
    return this.contentService.findOne(+id);
  }
}
