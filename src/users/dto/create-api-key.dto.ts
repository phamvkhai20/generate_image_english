import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Tên dịch vụ (ví dụ: groq, openai)',
    example: 'groq',
    required: true
  })
  service: string;

  @ApiProperty({
    description: 'API key của dịch vụ',
    example: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    required: true
  })
  key: string;
}