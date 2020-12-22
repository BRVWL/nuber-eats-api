import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((_is) => String)
  @Column()
  @IsString()
  @Length(3, 45)
  name: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  address: string;

  @Field((_is) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];

  @Field((_is) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((_is) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @RelationId((restaurant: Restaurant) => restaurant.user)
  userId: number;
}
