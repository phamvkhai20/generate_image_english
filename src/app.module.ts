import { ConfigModule, ConfigService } from '@nestjs/config';
import { Credit } from './credits/entities/credit.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { ContentModule } from './content/content.module';
import { CreditsModule } from './credits/credits.module';
import { Module } from '@nestjs/common';
import { TemplateModule } from './template/template.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInterceptor } from './auth/user.interceptor';
import { UsersModule } from './users/users.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TemplateModule,
    VocabularyModule,
    AuthModule,
    ChatModule,
    UsersModule,
    ContentModule,
    CreditsModule,
  ],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
