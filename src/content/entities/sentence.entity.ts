import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Content } from './content.entity';
import { Exclude } from 'class-transformer';

@Entity('sentences')
export class Sentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column()
  order: number;

  @ManyToOne(() => Content, content => content.sentencesList, {
    onDelete: 'CASCADE'
  })
  @Exclude()
  content: Content;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}