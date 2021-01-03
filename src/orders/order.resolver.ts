import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dto/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dto/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dto/getOrders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation((willReturn) => CreateOrderOutput)
  @Role([UserRole.client])
  async createOrder(
    @AuthUser() customer: User,
    @Args('data') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }

  @Query((willReturn) => GetOrdersOutput)
  @Role(['any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('data') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrdersInput);
  }

  @Query((willReturn) => GetOrderOutput)
  @Role(['any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('data') getOrderInput: GetOrderInput,
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrder(user, getOrderInput);
  }

  @Query((willReturn) => EditOrderOutput)
  @Role(['any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('data') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput);
  }
}
