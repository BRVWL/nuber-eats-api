import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, Length } from 'class-validator';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((_is) => Number) // for graphql shema
  @PrimaryGeneratedColumn() // for auto id inc
  id: number;

  @Field((_is) => String)
  @Column()
  @IsString() // dto validation
  @Length(3, 45) // dto validation
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
