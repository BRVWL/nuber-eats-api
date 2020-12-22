import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'photo',
  'options',
  'description',
]) {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends MutationOutput {
  @Field((type) => Dish, { nullable: true })
  dish?: Dish;
}
