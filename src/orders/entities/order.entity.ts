import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((_is) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer?: User;
  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field((_is) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  deliver?: User;
  @RelationId((order: Order) => order.deliver)
  deliverId: number;

  @Field((_is) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  restaurant?: Restaurant;

  @Field((_is) => [OrderItem])
  @ManyToMany((type) => OrderItem)
  @JoinTable()
  dishes: OrderItem[];

  @Field((_is) => Number, { nullable: true })
  @Column({ nullable: true })
  totalPrice?: number;

  @Field((_is) => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;
}
