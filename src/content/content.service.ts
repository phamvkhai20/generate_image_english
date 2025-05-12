import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { Sentence } from './entities/sentence.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const { title, content } = createContentDto;

    // Tách nội dung thành các câu
    const sentences = content
      .split(/[.!?](?=\s|[A-Z]|$)/)
      .filter((sentence) => sentence.trim().length > 0)
      .map((sentence) => sentence.trim());

    // Tạo entity mới
    const newContent = this.contentRepository.create({
      title,
      sentences,
      fullContent: content,
    });

    // Tạo danh sách các Sentence entities
    const sentenceEntities = sentences.map((text, index) => {
      const sentence = new Sentence();
      sentence.text = text;
      sentence.order = index + 1;
      sentence.content = newContent;
      return sentence;
    });

    // Gán danh sách sentences vào content
    newContent.sentencesList = sentenceEntities;

    // Lưu vào database và transform response
    const savedContent = await this.contentRepository.save(newContent);
    return instanceToPlain(savedContent) as Content;
  }

  async findAll(): Promise<Content[]> {
    const contents = await this.contentRepository.find();
    return instanceToPlain(contents) as Content[];
  }

  async findOne(id: number): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });
    return instanceToPlain(content) as Content;
  }
}
