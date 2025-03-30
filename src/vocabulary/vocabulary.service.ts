import * as nodeFetch from 'node-fetch';
import * as sharp from 'sharp';

import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';

@Injectable()
export class VocabularyService {
  private unsplash;

  constructor() {
    this.unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch.default as any,
    });
  }

  async generateImage(createVocabularyDto: CreateVocabularyDto): Promise<Buffer> {
    const { word, relatedPhrases } = createVocabularyDto;

    // Helper function to encode special characters
    const encodeXML = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

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

    // Download and convert image to base64
    const imageUrl = result.response?.results[0]?.urls?.regular || '';
    const imageResponse = await nodeFetch.default(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    // Remove the composite image creation part and directly use the base64 image in SVG
    const svg = `
      <svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00CED1" />
            <stop offset="100%" style="stop-color:#20B2AA" />
          </linearGradient>
          <clipPath id="imageClip">
            <rect x="100" y="${220 + relatedPhrases.length * 60 + 40}" width="600" height="300" rx="8"/>
          </clipPath>
        </defs>
        <style>
          .header { 
            font-family: 'Arial', sans-serif; 
            font-size: 22px; 
            font-weight: 700;
            fill: #000000;
          }
          .main-word { 
            font-family: 'Arial', sans-serif; 
            font-size: 28px;
            font-weight: 700;
            fill: #1a365d;
          }
          .ipa {
            font-family: 'Arial', sans-serif;
            font-size: 20px;
            fill: #4a5568;
            font-style: italic;
          }
          .meaning {
            font-family: 'Arial', sans-serif;
            font-size: 20px;
            fill: #4a5568;
          }
          .phrase {
            font-family: 'Arial', sans-serif;
            font-size: 18px;
            fill: #2d3748;
          }
          .translation {
            font-family: 'Arial', sans-serif;
            font-size: 18px;
            fill: #4a5568;
          }
        </style>
        
        <!-- Background with image -->
        <rect width="800" height="1000" fill="url(#background-image)"/>
        <rect width="800" height="1000" fill="url(#bg-gradient)" opacity="0.85"/>
        
        <!-- Header Box -->
        <rect x="50" y="30" width="700" height="60" rx="8" fill="white"/>
        <text x="400" y="70" text-anchor="middle" class="header">Từ vựng tiếng Anh</text>
        
        <!-- Main Content Box -->
        <rect x="50" y="110" width="700" height="840" rx="10" fill="white"/>
        
        <!-- Main Word Section -->
        <text x="100" y="170" class="main-word">${encodeXML(word)}</text>
        <text x="220" y="170" class="ipa">${encodeXML('/ˈlɪs.ən/')}</text>
        <text x="350" y="170" class="meaning">${encodeXML('– (nghe) 🎧')}</text>

        <!-- Phrases -->
        ${relatedPhrases.map((phrase, index) => {
          const [eng, viet] = phrase.split(' – ').map(encodeXML);
          return `
            <g transform="translate(0, ${220 + index * 60})">
              <text x="100" y="0" class="phrase">${eng}</text>
              <text x="100" y="25" class="translation">– ${viet}</text>
            </g>
          `;
        }).join('')}

        <!-- Related Image Container -->
        <rect 
          x="100" 
          y="${220 + relatedPhrases.length * 60 + 40}" 
          width="600" 
          height="300" 
          fill="white"
          stroke="#E2E8F0"
          stroke-width="1"
          rx="8"
        />
        
        <!-- Related Image -->
        <image 
          href="${base64Image}" 
          x="100" 
          y="${220 + relatedPhrases.length * 60 + 40}"
          width="600"
          height="300"
          clip-path="url(#imageClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    `;

    return await sharp(Buffer.from(svg)).png().toBuffer();
  }
}
