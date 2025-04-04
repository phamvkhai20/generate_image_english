import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post('generate-image')
  async generateImage(
    @Body() createVocabularyDto: CreateVocabularyDto,
    @Res() res: Response,
  ) {
    const buffer = await this.vocabularyService.generateSingleImage(createVocabularyDto);

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="vocabulary.png"',
    });

    res.send(buffer);
  }

  @Post('generate-images')
  async generateImages(@Body() vocabularies: CreateVocabularyDto[]): Promise<Buffer[]> {
    return this.vocabularyService.generateImages(vocabularies);
  }
}
