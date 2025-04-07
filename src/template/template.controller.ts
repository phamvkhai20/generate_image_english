import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTemplateDto } from '../vocabulary/dto/create-template.dto';
import { TemplateService } from './template.service';
import { Template } from '../entities/template.entity';
import { TemplateResponse } from '../types/template.response';

@ApiTags('templates')
@Controller('api/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
    type: TemplateResponse,
  })
  async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateResponse> {
    return this.templateService.createTemplate(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({
    status: 200,
    description: 'List of all templates',
    type: [TemplateResponse],
  })
  async getAllTemplates(): Promise<TemplateResponse[]> {
    return this.templateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by id' })
  @ApiResponse({
    status: 200,
    description: 'Template found',
    type: TemplateResponse,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplate(@Param('id') id: string): Promise<TemplateResponse> {
    return this.templateService.findOne(id);
  }
}
