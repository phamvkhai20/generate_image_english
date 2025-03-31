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
      // Register fonts with error handling
      const fontPath = path.join(process.cwd(), 'src/assets/fonts');
      registerFont(path.join(fontPath, 'NotoSans-Regular.ttf'), { family: 'Noto Sans' });
      registerFont(path.join(fontPath, 'NotoSans-Bold.ttf'), { family: 'Noto Sans', weight: 'bold' });
      registerFont(path.join(fontPath, 'NotoSans-Italic.ttf'), { family: 'Noto Sans', style: 'italic' });
    } catch (error) {
      console.error('Font registration failed:', error);
    }

    this.unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch.default as any,
    });
  }

  async generateImages(vocabularies: CreateVocabularyDto[]): Promise<Buffer[]> {
    const imageBuffers: Buffer[] = [];
    
    for (const vocabulary of vocabularies) {
      const buffer = await this.generateSingleImage(vocabulary);
      imageBuffers.push(buffer);
    }
    
    return imageBuffers;
  }

  public async generateSingleImage(createVocabularyDto: CreateVocabularyDto): Promise<Buffer> {
    const { word, emoji, relatedPhrases, meaning, ipa } = createVocabularyDto;
    
    let imageUrl = '';
    try {
      // Get image from Unsplash
      const result = await this.unsplash.search.getPhotos({
        query: word,
        orientation: 'landscape',
        perPage: 1,
        contentFilter: 'high',
      });

      imageUrl = result.response?.results[0]?.urls?.regular || '';
    } catch (error) {
      console.error('Unsplash API error:', error);
      // Fallback to a placeholder image
      imageUrl = 'https://via.placeholder.com/600x300';
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
    ctx.roundRect(50, 110, 700, 500, 10); // Reduced height for content box
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

    // Draw meaning
    ctx.font = '20px sans-serif';
    const meaningText = `– (${meaning}) `;
    ctx.fillText(meaningText, 350, 170);
    
    // Draw emoji directly
    ctx.font = '24px sans-serif';
    ctx.textBaseline = 'middle';
    const meaningWidth = ctx.measureText(meaningText).width;
    ctx.fillText(emoji, 350 + meaningWidth, 170);

    // Reset font for remaining text
    ctx.font = '18px "Noto Sans"';
    ctx.textBaseline = 'alphabetic';

    // Update other text renderings to use system font
    ctx.font = 'bold 22px sans-serif';  // Header
    ctx.font = 'bold 28px sans-serif';  // Main word
    ctx.font = 'italic 20px sans-serif'; // IPA
    ctx.font = '18px sans-serif';       // Phrases

    // Draw phrases
    ctx.font = '18px "Noto Sans"';
    const phraseEndY = relatedPhrases.reduce((y, phrase, index) => {
      const [eng, viet] = phrase.split(' – ');
      ctx.fillStyle = '#2d3748';
      ctx.fillText(eng, 100, y + index * 60);
      ctx.fillStyle = '#4a5568';
      ctx.fillText(`– ${viet}`, 100, y + 25 + index * 60);
      return y + index * 60;
    }, 220);

    // Draw related image directly without background box
    // Draw terminal-like window for image
    const imageY = 650;
    
    // Draw terminal header
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.roundRect(50, imageY, 700, 30, [10, 10, 0, 0]);
    ctx.fill();

    // Draw terminal buttons
    const buttonColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
    buttonColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(75 + (i * 25), imageY + 15, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw terminal content area
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.roundRect(50, imageY + 30, 700, 270, [0, 0, 10, 10]);
    ctx.fill();

    // Draw image in terminal window
    try {
      const img = await loadImage(imageUrl);
      const padding = 20;
      const maxWidth = 700 - (padding * 2);
      const maxHeight = 270 - (padding * 2);
      
      // Calculate aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      
      // Center the image
      const x = 50 + padding + (maxWidth - width) / 2;
      const y = imageY + 30 + padding + (maxHeight - height) / 2;
      
      ctx.drawImage(img, x, y, width, height);
    } catch (error) {
      console.error('Image loading error:', error);
      ctx.strokeStyle = '#4A4A4A';
      ctx.strokeRect(70, imageY + 50, 660, 230);
    }

    return canvas.toBuffer('image/png');
  }
}
