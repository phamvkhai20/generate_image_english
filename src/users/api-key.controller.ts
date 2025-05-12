import { Controller, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async saveApiKey(@Request() req, @Body() body: { service: string; key: string }) {
    const userId = req.user.userId;
    return this.usersService.saveApiKey(userId, body.service, body.key);
  }

  @Delete()
  async deleteApiKey(@Request() req, @Body() body: { service: string }) {
    const userId = req.user.userId;
    return this.usersService.deleteApiKey(userId, body.service);
  }
}