import { ApiKeyController } from './api-key.controller';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController, ApiKeyController],
  exports: [UsersService],
})
export class UsersModule {}
