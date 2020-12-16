import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

// Using Entity obj for extending fields
@InputType()
export class CreateRestaurantInput extends PickType(
  Restaurant,
  ['name', 'address', 'coverImage'],
  InputType,
) {
  @Field((_type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends MutationOutput {
  @Field((_type) => Restaurant, { nullable: true })
  restaurant: Restaurant;
}
