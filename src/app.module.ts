import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary/vocabulary.controller';
import { VocabularyService } from './vocabulary/vocabulary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class AppModule {}
