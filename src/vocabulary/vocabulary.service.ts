import * as nodeFetch from 'node-fetch';
import * as path from 'path';

import { createCanvas, loadImage } from 'canvas';

import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';
import { registerFont } from 'canvas';

@Injectable()
export class VocabularyService {
  private unsplash;

  constructor() {
    try {
      // Register fonts
      registerFont(path.join(process.cwd(), 'src/assets/fonts/NotoSans-Regular.ttf'), { family: 'Noto Sans' });
      registerFont(path.join(process.cwd(), 'src/assets/fonts/NotoSans-Bold.ttf'), { family: 'Noto Sans', weight: 'bold' });
      registerFont(path.join(process.cwd(), 'src/assets/fonts/NotoSans-Italic.ttf'), { family: 'Noto Sans', style: 'italic' });
      registerFont(path.join(process.cwd(), 'src/assets/fonts/NotoEmoji-Regular.ttf'), { family: 'Noto Emoji' });
    } catch (error) {
      console.error('Font registration error:', error);
      // Fallback to system fonts if registration fails
    }

    this.unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch.default as any,
    });
  }

  async generateImage(createVocabularyDto: CreateVocabularyDto): Promise<Buffer> {
    const { word,emoji, relatedPhrases,meaning, ipa } = createVocabularyDto;

    // Get image from Unsplash
    const result = await this.unsplash.search.getPhotos({
      query: word,
      orientation: 'landscape',
      perPage: 1,
      contentFilter: 'high',
    });

    if (!result.response) {
      throw new Error('Failed to fetch image from Unsplash');
    }

    // Create canvas
    const canvas = createCanvas(800, 1000);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#00CED1';
    ctx.fillRect(0, 0, 800, 1000);

    // Draw header box
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(50, 30, 700, 60, 8);
    ctx.fill();

    // Draw header text
    ctx.font = 'bold 22px "Noto Sans"';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Từ vựng tiếng Anh', 400, 60);

    // Draw main content box
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(50, 110, 700, 840, 10);
    ctx.fill();

    // Draw main word
    ctx.font = 'bold 28px "Noto Sans"';
    ctx.fillStyle = '#1a365d';
    ctx.textAlign = 'left';
    ctx.fillText(word, 100, 170);

    // Draw IPA
    ctx.font = 'italic 20px "Noto Sans"';
    ctx.fillStyle = '#4a5568';
    ctx.fillText(ipa, 220, 170);

    // Update the meaning text rendering
    // Draw meaning
    ctx.font = '20px "Noto Emoji", "Noto Sans"';
    ctx.fillText(`– (${meaning}) ${emoji}`, 350, 170);

    // Draw phrases
    ctx.font = '18px "Noto Sans"';
    relatedPhrases.forEach((phrase, index) => {
      const [eng, viet] = phrase.split(' – ');
      ctx.fillStyle = '#2d3748';
      ctx.fillText(eng, 100, 220 + index * 60);
      ctx.fillStyle = '#4a5568';
      ctx.fillText(`– ${viet}`, 100, 245 + index * 60);
    });

    // Draw related image
    const imageUrl = result.response?.results[0]?.urls?.regular || '';
    const img = await loadImage(imageUrl);
    const imageY = 220 + relatedPhrases.length * 60 + 40;
    ctx.drawImage(img, 100, imageY, 600, 300);

    return canvas.toBuffer('image/png');
  }
}
