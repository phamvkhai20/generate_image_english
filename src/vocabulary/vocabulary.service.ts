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
    let photos = [];

    // Create canvas with square dimensions
    const canvas = createCanvas(1100, 1100);
    const ctx = canvas.getContext('2d');

    // Set terminal background
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 1100, 1100);

    // Draw main terminal window
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.roundRect(0, 0, 1100, 1100, 10);
    ctx.fill();

    // Draw title bar
    const gradient = ctx.createLinearGradient(0, 0, 0, 40);  // Increased height
    gradient.addColorStop(0, '#3D3D3D');
    gradient.addColorStop(1, '#2A2A2A');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1100, 40, [10, 10, 0, 0]);  // Increased height
    ctx.fill();

    // Add title text
    ctx.fillStyle = '#ABB2BF';
    ctx.font = '16px Menlo, Monaco, monospace';  // Increased font size
    ctx.textAlign = 'left';  // Align left
    ctx.fillText(`${word}.png`, 100, 25);  // Adjusted position

    // Draw terminal buttons (adjusted vertical position)
    const buttonColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
    const buttonShadows = ['#E33E32', '#E09E1A', '#1AAB29'];
    buttonColors.forEach((color, i) => {
      // Button shadow/border
      ctx.fillStyle = buttonShadows[i];
      ctx.beginPath();
      ctx.arc(25 + i * 25, 20, 7, 0, Math.PI * 2);  // Adjusted y position
      ctx.fill();

      // Button main color
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(25 + i * 25, 20, 6, 0, Math.PI * 2);  // Adjusted y position
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
    ctx.fillText(word, 50, 100);

    // Draw IPA
    ctx.fillStyle = '#ABB2BF'; // Light gray
    ctx.font = '30px Menlo, Monaco, monospace';
    ctx.fillText(ipa, 270, 100);

    // Draw meaning
    ctx.fillStyle = '#98C379'; // Light green
    ctx.font = '30px Menlo, Monaco, monospace';
    const meaningText = `– (${meaning}) `;
    ctx.fillText(meaningText, 500, 100);

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
    const gridSize = 220;
    const gap = 15;
    const startX = (1100 - (gridSize * 4 + gap * 3)) / 2;
    const startY = 800;

    try {
      // Get images from Unsplash
      const result = await this.unsplash.search.getPhotos({
        query: word.replace(/[^\w\s]/g, ''),
        orientation: 'squarish',
        perPage: 4,
        contentFilter: 'high',
      });

      photos = result.response?.results || [];
  
      if (photos.length === 0 && emoji) {
        const emojiResult = await this.unsplash.search.getPhotos({
          query: word,
          orientation: 'squarish',
          perPage: 4,
          contentFilter: 'high',
        });
        photos = emojiResult.response?.results || [];
      }

      // Draw container border first
      const containerWidth = gridSize * 4 + gap * 3;
      const containerHeight = gridSize;
      const containerX = startX - 15;
      const containerY = startY - 15;
      
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(containerX, containerY, containerWidth + 30, containerHeight + 30, 10);
      const borderGradient = ctx.createLinearGradient(
        containerX,
        containerY,
        containerX + containerWidth,
        containerY + containerHeight
      );
      borderGradient.addColorStop(0, '#61AFEF');
      borderGradient.addColorStop(0.5, '#C678DD');
      borderGradient.addColorStop(1, '#98C379');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Draw images in horizontal row
      for (let i = 0; i < Math.min(photos.length, 4); i++) {
        const img = await loadImage(photos[i].urls.regular);
        const x = startX + i * (gridSize + gap);
        const y = startY;

        ctx.save();
        // Draw image with rounded corners
        ctx.beginPath();
        ctx.roundRect(x, y, gridSize, gridSize, 8);
        ctx.clip();

        // Calculate image scaling to fill the square
        const scale = Math.max(gridSize / img.width, gridSize / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (gridSize - scaledWidth) / 2;
        const offsetY = (gridSize - scaledHeight) / 2;

        ctx.drawImage(img, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        ctx.restore();

        // Add subtle overlay for each image
        ctx.fillStyle = 'rgba(30, 30, 30, 0.1)';
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    } catch (error) {
      // Fallback with styled placeholder
      for (let i = 0; i < 4; i++) {
        const x = startX + i * (gridSize + gap);
        const y = startY;
        
        ctx.strokeStyle = '#3D3D3D';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, gridSize, gridSize);
      }
      ctx.setLineDash([]);
    }

    return canvas.toBuffer('image/png');
  }
}
