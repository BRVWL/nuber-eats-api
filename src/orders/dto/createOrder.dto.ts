import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
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
