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
      registerFont(path.join(fontPath, 'NotoSans-Regular.ttf'), {
        family: 'Noto Sans',
      });
      registerFont(path.join(fontPath, 'NotoSans-Bold.ttf'), {
        family: 'Noto Sans',
        weight: 'bold',
      });
      registerFont(path.join(fontPath, 'NotoSans-Italic.ttf'), {
        family: 'Noto Sans',
        style: 'italic',
      });
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
  public async generateSingleImage(
    createVocabularyDto: CreateVocabularyDto,
  ): Promise<Buffer> {
    const { word, emoji, relatedPhrases, meaning, ipa } = createVocabularyDto;

    let imageUrl = '';
    try {
      // Get image from Unsplash
      const result = await this.unsplash.search.getPhotos({
        query: word.replace(/[^\w\s]/g, ''), // Remove special characters for better search
        orientation: 'landscape',
        perPage: 1,
        contentFilter: 'high',
      });

      imageUrl = result.response?.results[0]?.urls?.regular || '';

      // If no image found and emoji exists, try searching with emoji description
      if (!imageUrl && emoji) {
        const emojiResult = await this.unsplash.search.getPhotos({
          query: word,
          orientation: 'landscape',
          perPage: 1,
          contentFilter: 'high',
        });
        imageUrl = emojiResult.response?.results[0]?.urls?.regular || '';
      }
    } catch (error) {
      console.error('Unsplash API error:', error);
      imageUrl = 'https://via.placeholder.com/600x300';
    }

    // Create canvas with full width
    const canvas = createCanvas(1100, 1420);
    const ctx = canvas.getContext('2d');

    // Set terminal background
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 1100, 1420);

    // Draw main terminal window
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.roundRect(0, 0, 1100, 1420, 10);
    ctx.fill();

    // Draw title bar
    const gradient = ctx.createLinearGradient(0, 0, 0, 30);
    gradient.addColorStop(0, '#3D3D3D');
    gradient.addColorStop(1, '#2A2A2A');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1100, 30, [10, 10, 0, 0]);
    ctx.fill();

    // Draw terminal buttons with macOS style (adjusted position)
    const buttonColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
    const buttonShadows = ['#E33E32', '#E09E1A', '#1AAB29'];
    buttonColors.forEach((color, i) => {
      // Button shadow/border
      ctx.fillStyle = buttonShadows[i];
      ctx.beginPath();
      ctx.arc(25 + i * 25, 15, 7, 0, Math.PI * 2);
      ctx.fill();

      // Button main color
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(25 + i * 25, 15, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw content with terminal-style text
    // ctx.fillStyle = '#98C379'; // Light green
    // ctx.font = 'bold 32px Menlo, Monaco, monospace';
    // ctx.textAlign = 'center';
    // ctx.fillText('TỪ MỚI', 600, 110);
    // ctx.textBaseline = 'alphabetic';

    // Draw main word section
    ctx.textAlign = 'left';
    ctx.fillStyle = '#61AFEF'; // Light blue
    ctx.font = 'bold 38px Menlo, Monaco, monospace';
    ctx.fillText(word, 50, 140);

    // Draw IPA
    ctx.fillStyle = '#ABB2BF'; // Light gray
    ctx.font = '30px Menlo, Monaco, monospace';
    ctx.fillText(ipa, 270, 140);

    // Draw meaning
    ctx.fillStyle = '#98C379'; // Light green
    ctx.font = '30px Menlo, Monaco, monospace';
    const meaningText = `– (${meaning}) `;
    ctx.fillText(meaningText, 500, 140);

    // Draw phrases with terminal commands style
    ctx.font = '28px Menlo, Monaco, monospace';
    let currentY = 220;
    for (const phrase of relatedPhrases) {
      const [eng, viet] = phrase.split(' – ');
      ctx.fillStyle = '#C678DD'; // Purple for commands
      ctx.fillText(`$ ${eng}`, 50, currentY);
      ctx.fillStyle = '#E5C07B'; // Soft yellow for output
      ctx.fillText(`> ${viet}`, 50, currentY + 40);
      currentY += 90;
    }

    // Draw image section with terminal frame
    const imageY = 700;
    try {
      const img = await loadImage(imageUrl);
      const maxWidth = 1000; // Adjusted width
      const maxHeight = 600;

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;

      const x = (1100 - width) / 2; // Center horizontally
      const y = imageY + (maxHeight - height) / 2;

      // Add image container with gradient border
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x - 15, y - 15, width + 30, height + 30, 10);
      const borderGradient = ctx.createLinearGradient(
        x,
        y,
        x + width,
        y + height,
      );
      borderGradient.addColorStop(0, '#61AFEF'); // Blue
      borderGradient.addColorStop(0.5, '#C678DD'); // Purple
      borderGradient.addColorStop(1, '#98C379'); // Green
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw image with rounded corners
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 8);
      ctx.clip();
      ctx.drawImage(img, x, y, width, height);
      ctx.restore();

      // Add subtle overlay for better text contrast
      ctx.fillStyle = 'rgba(30, 30, 30, 0.1)';
      ctx.fillRect(x, y, width, height);
    } catch (error) {
      console.error('Image loading error:', error);
      // Fallback with styled placeholder
      ctx.strokeStyle = '#3D3D3D';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(90, imageY, 1020, 600);
      ctx.setLineDash([]);
    }

    return canvas.toBuffer('image/png');
  }
}
