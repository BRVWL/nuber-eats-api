import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { DishOption } from 'src/restaurants/entities/dish.entity';
import { Order } from '../entities/order.entity';
import { OrderItemOption } from '../entities/orderItem.entity';

@InputType()
export class CreateOrderItemInput {
  @Field((type) => Number)
  dishId: number;

  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
  @Field((type) => Number)
  restaurantId: number;

  @Field((type) => [CreateOrderItemInput])
  dishes: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends MutationOutput {}
