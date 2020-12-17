import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((_is) => String)
  @Column({ unique: true })
  @IsString()
  @Length(3, 45)
  name: string;

  @Field((_is) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  image: string;

  @Field((_is) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((_is) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
