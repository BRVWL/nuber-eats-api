import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((_is) => Number)
  @PrimaryColumn()
  id: number;

  @Field((_is) => String)
  @Column()
  name: string;

  @Field((_is) => String)
  @Column()
  address: string;

  @Field((_is) => Boolean)
  @Column()
  isVegan: boolean;
}
