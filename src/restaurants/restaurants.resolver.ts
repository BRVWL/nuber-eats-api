import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/createRestaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantOutput,
} from './dto/updateRestaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './services/restaurants.service';

@Resolver((_of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Query((_willReturn) => [Restaurant])
  @Role(['any'])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((_willReturn) => CreateRestaurantOutput)
  @Role([UserRole.owner])
  async createRestaurant(
    @Args('data') createRestaurantInput: CreateRestaurantInput,
    @AuthUser() authUser: User,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation((_willReturn) => UpdateRestaurantOutput)
  @Role([UserRole.owner])
  async updateRestaurant(
    @AuthUser() authUser: User,
    @Args()
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<UpdateRestaurantOutput> {
    try {
      return this.restaurantService.updateRestaurant(
        authUser,
        updateRestaurantDto,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
