import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query((willReturn) => [Restaurant])
  restaurants(
    @Args('veganOnly')
    veganOnly: boolean,
  ): Restaurant[] {
    return [];
  }

  @Mutation((willReturn) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log('debug  =========>  ', createRestaurantDto);
    return true;
  }
}
