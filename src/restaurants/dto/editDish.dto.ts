import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class EditDishInput extends PartialType(
  PickType(Dish, ['name', 'options', 'photo', 'price', 'description']),
) {
  @Field((type) => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends MutationOutput {}
