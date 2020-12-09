import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';

@ObjectType()
@Entity()
export class CoreEntity {
  @Field((_is) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_is) => Number)
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @Field((_is) => Number)
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
