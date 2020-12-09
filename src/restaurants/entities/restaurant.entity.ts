import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, Length } from 'class-validator';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((_is) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_is) => String)
  @Column()
  @IsString()
  @Length(3, 45)
  name: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  address: string;

  @Field((_is) => Boolean)
  @Column()
  @IsBoolean()
  isVegan: boolean;
}
