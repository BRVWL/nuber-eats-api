import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dto/createOrder.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,

    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,

    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, dishes }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Can not find the restaurant',
        };
      }
      let orderFinalPrice = 0;
      const orderedDishes: OrderItem[] = [];
      for (const item of dishes) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          return {
            ok: false,
            error: 'Can not find the dish',
          };
        }
        let finalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (o) => o.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extraPrice) {
              finalPrice = finalPrice + dishOption.extraPrice;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extraPrice) {
                  finalPrice = finalPrice + dishOptionChoice.extraPrice;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + finalPrice;
        const _orderedDish = this.orderItems.create({
          dish,
          options: item.options,
        });
        const orderedDish = await this.orderItems.save(_orderedDish);
        orderedDishes.push(orderedDish);
      }
      const _order = this.orders.create({
        customer,
        restaurant,
        totalPrice: orderFinalPrice,
        dishes: orderedDishes,
      });
      const order = await this.orders.save(_order);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
