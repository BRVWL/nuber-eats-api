import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((_is) => String)
  @Column()
  @IsString() // dto validation
  @Length(3, 45) // dto validation
  name: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  address: string;

  @Field((_is) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((_is) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;
}
