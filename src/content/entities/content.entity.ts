import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sentence } from './sentence.entity';
import { Exclude } from 'class-transformer';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('json', { nullable: true })
  sentences: string[];

  @Column('text')
  fullContent: string;

  @OneToMany(() => Sentence, (sentence) => sentence.content, {
    cascade: true,
    eager: true
  })
  sentencesList: Sentence[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}