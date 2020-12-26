import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/createOrder.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation((willReturn) => CreateOrderOutput)
  @Role([UserRole.client])
  createOrder(
    @AuthUser() customer: User,
    @Args('data') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.createOrder(customer, createOrderInput);
  }
}
