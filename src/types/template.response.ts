import { ApiProperty } from '@nestjs/swagger';

export class TemplateResponse {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'My Template' })
  name: string;

  @ApiProperty({
    type: 'object',
    properties: {
      width: { type: 'number', example: 800 },
      height: { type: 'number', example: 600 },
      background: { type: 'string', example: '#ffffff' },
      borderRadius: { type: 'number', example: 8 },
      borderColor: { type: 'string', example: '#000000' },
      borderWidth: { type: 'number', example: 1 },
      elements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'element-1' },
            type: { type: 'string', example: 'text' },
            x: { type: 'number', example: 100 },
            y: { type: 'number', example: 100 },
            width: { type: 'number', example: 200 },
            height: { type: 'number', example: 50 },
            rotation: { type: 'number', example: 0 },
            content: { type: 'string', example: 'Hello World' },
            style: {
              type: 'object',
              properties: {
                fontSize: { type: 'number', example: 24 },
                fontFamily: { type: 'string', example: 'Arial' },
                fill: { type: 'string', example: '#000000' },
                stroke: { type: 'string', example: '#000000' },
                strokeWidth: { type: 'number', example: 0 }
              }
            }
          }
        }
      }
    }
  })
  metadata: {
    width: number;
    height: number;
    background?: string;
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    elements?: Array<{
      id: string;
      type: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
      rotation?: number;
      content?: string;
      style?: {
        fontSize?: number;
        fontFamily?: string;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
      };
    }>;
  };

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}