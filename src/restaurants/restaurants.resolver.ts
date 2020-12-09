import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './services/restaurants.service';

@Resolver((_of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Query((_willReturn) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((_willReturn) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log('debug  =========>  ', createRestaurantDto);
    return true;
  }
}
