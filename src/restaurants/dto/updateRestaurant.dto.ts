import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantInput } from './createRestaurant.dto';

@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantInput,
) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((_type) => Number)
  id: number;

  @Field((_type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
