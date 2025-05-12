import { ApiKey } from './entities/api-key.entity';
import { ApiKeyController } from './api-key.controller';
import { CreditsModule } from 'src/credits/credits.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey]), CreditsModule],
  providers: [UsersService],
  controllers: [UsersController, ApiKeyController],
  exports: [UsersService],
})
export class UsersModule {}
