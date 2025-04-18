import { ConfigModule, ConfigService } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { TemplateModule } from './template/template.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TemplateModule,
    VocabularyModule,
  ],
})
export class AppModule {}
