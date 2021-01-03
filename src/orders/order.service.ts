import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dto/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dto/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dto/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dto/getOrders.dto';
import { Order, OrderStatus } from './entities/order.entity';
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
        if (item.options) {
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

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === UserRole.client) {
        orders = await this.orders.find({
          where: { customer: user, ...(status && { status }) },
        });
      } else if (user.role === UserRole.delivery) {
        orders = await this.orders.find({
          where: { deliver: user, ...(status && { status }) },
        });
      } else if (user.role === UserRole.owner) {
        const restaurants = await this.restaurants.find({
          where: { user },
          relations: ['orders'],
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      return {
        ok: true,
        error: null,
        orders,
      };
    } catch (error) {
      console.log(error);
    }
  }

  hasUserPermissionsToOrder(user: User, order: Order) {
    let isAllow = true;
    if (
      order.customerId !== user.id &&
      order.deliverId !== user.id &&
      order.restaurant.userId !== user.id
    ) {
      isAllow = false;
    }
    return isAllow;
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant', 'dishes'],
      });
      if (!order) {
        return {
          ok: false,
          error: 'Can not find the order',
        };
      }
      if (!this.hasUserPermissionsToOrder(user, order)) {
        return {
          ok: false,
          error: 'You can not see this',
        };
      }
      return { ok: true, order, error: null };
    } catch (error) {
      console.log(error);
    }
  }

  async editOrder(
    user: User,
    { id, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(id, {
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found',
        };
      }
      if (!this.hasUserPermissionsToOrder(user, order)) {
        return {
          ok: false,
          error: 'You can not see this',
        };
      }
      let canEdit = true;
      if (user.role === UserRole.client) {
        canEdit = false;
      }
      if (user.role === UserRole.owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
        }
      }
      if (user.role === UserRole.delivery) {
        if (
          status !== OrderStatus.PickedUp &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: 'You can not edit this order',
        };
      }
      await this.orders.save([{ id, status }]);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
