import * as sharp from 'sharp';

import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VocabularyService {
  async generateImage(
    createVocabularyDto: CreateVocabularyDto,
  ): Promise<Buffer> {
    const { word, relatedPhrases } = createVocabularyDto;

    // Create SVG template
    const svg = `
      <svg width="800" height="600">
        <style>
          .title { font: bold 40px sans-serif; }
          .phrase { font: 24px sans-serif; }
        </style>
        <rect width="800" height="600" fill="white"/>
        <text x="400" y="100" text-anchor="middle" class="title">${word}</text>
        ${relatedPhrases
          .map(
            (phrase, index) =>
              `<text x="400" y="${200 + index * 50}" text-anchor="middle" class="phrase">${phrase}</text>`,
          )
          .join('')}
      </svg>
    `;

    // Convert SVG to PNG
    return await sharp(Buffer.from(svg)).png().toBuffer();
  }
}
