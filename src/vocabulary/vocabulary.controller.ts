import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { GenerateTemplateImageDto } from './dto/generate-template-image.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post('generate-image')
  async generateImage(
    @Body() createVocabularyDto: CreateVocabularyDto,
    @Res() res: Response,
  ) {
    const buffer = await this.vocabularyService.generateSingleImage(
      createVocabularyDto,
    );

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="vocabulary.png"',
    });

    res.send(buffer);
  }

  @Post('generate-images')
  async generateImages(
    @Body() vocabularies: CreateVocabularyDto[],
    @Res() res: Response,
  ) {
    const buffers = await this.vocabularyService.generateImages(vocabularies);
    
    // Combine all buffers into a single buffer
    const combinedBuffer = Buffer.concat(buffers);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': combinedBuffer.length,
    });
    res.end(combinedBuffer);
  }

  @Post('generate-template')
  async generateTemplateImage(
    @Body() generateTemplateImageDto: GenerateTemplateImageDto,
    @Res() res: Response,
  ) {
    const buffer = await this.vocabularyService.generateImageFromTemplate(
      generateTemplateImageDto.templateId, // Changed from template to templateId
      generateTemplateImageDto.dynamicContent,
    );

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
