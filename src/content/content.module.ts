import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { Sentence } from './entities/sentence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Sentence])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
