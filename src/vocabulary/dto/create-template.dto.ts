import { ApiProperty } from '@nestjs/swagger';

export class ElementStyleDto {
  @ApiProperty({ example: 24 })
  fontSize?: number;

  @ApiProperty({ example: 'Arial' })
  fontFamily?: string;

  @ApiProperty({ example: '#000000' })
  fill?: string;

  @ApiProperty({ example: '#000000' })
  stroke?: string;

  @ApiProperty({ example: 0 })
  strokeWidth?: number;
}

export class ElementDto {
  @ApiProperty({ example: 'text-1' })
  id: string;

  @ApiProperty({ example: 'text' })
  type: string;

  @ApiProperty({ example: '9.63%' })
  x: string;

  @ApiProperty({ example: '14.17%' })
  y: string;

  @ApiProperty({ example: '25.00%' })
  width: string;

  @ApiProperty({ example: '8.33%' })
  height: string;

  @ApiProperty({ example: 0 })
  rotation: number;

  @ApiProperty({ example: '{{test}}' })
  content: string;

  @ApiProperty({ type: ElementStyleDto })
  style: ElementStyleDto;
}

export class MetadataDto {
  @ApiProperty({ example: 800 })
  width: number;

  @ApiProperty({ example: 600 })
  height: number;

  @ApiProperty({ example: '#ffffff' })
  background: string;

  @ApiProperty({ example: 8 })
  borderRadius: number;

  @ApiProperty({ example: 1 })
  borderWidth: number;

  @ApiProperty({ example: '#000000' })
  borderColor: string;

  @ApiProperty({ example: 'solid' })
  borderStyle: string;

  @ApiProperty({ type: [ElementDto] })
  elements: ElementDto[];
}

export class CreateTemplateDto {
  @ApiProperty({ example: 'Test Template' })
  name: string;

  @ApiProperty({ type: MetadataDto })
  metadata: MetadataDto;
}
