import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreditsService } from './credits.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CreditDto } from './dto/credit.dto';

@ApiTags('credits')
@Controller('credits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post('transaction')
  @ApiOperation({ summary: 'Tạo giao dịch credit mới' })
  @ApiResponse({
    status: 201,
    description: 'Giao dịch được tạo thành công',
    type: CreditDto,
  })
  async createTransaction(
    @Request() req,
    @Body() createCreditDto: CreateCreditDto,
  ) {
    return this.creditsService.createTransaction(req.user.userId, createCreditDto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Lấy số dư hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Số dư được trả về thành công',
    type: Number,
  })
  async getBalance(@Request() req) {
    return this.creditsService.getCurrentBalance(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch' })
  @ApiResponse({
    status: 200,
    description: 'Lịch sử giao dịch được trả về thành công',
    type: [CreditDto],
  })
  async getTransactionHistory(@Request() req) {
    return this.creditsService.getTransactionHistory(req.user.userId);
  }
}