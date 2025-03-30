import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary/vocabulary.controller';
import { VocabularyService } from './vocabulary/vocabulary.service';

@Module({
  imports: [],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class AppModule {}
