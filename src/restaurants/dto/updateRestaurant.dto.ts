import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './createRestaurant.dto';

@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantDto,
) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((_type) => Number)
  id: number;

  @Field((_type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
