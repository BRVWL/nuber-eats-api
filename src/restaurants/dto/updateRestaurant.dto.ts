import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantInput } from './createRestaurant.dto';

@InputType()
export class UpdateRestaurantInput extends PartialType(CreateRestaurantInput) {}

@ObjectType()
export class UpdateRestaurantOutput extends MutationOutput {
  @Field((_type) => Restaurant, { nullable: true })
  restaurant: Restaurant;
}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((_type) => Number)
  id: number;

  @Field((_type) => UpdateRestaurantInput)
  data: UpdateRestaurantInput;
}
