import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dto/allCategories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/createRestaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/deleteRestaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantOutput,
} from './dto/updateRestaurant.dto';
import { Category } from './entities/category.entity';
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
    return this.restaurantService.updateRestaurant(
      authUser,
      updateRestaurantDto,
    );
  }

  @Mutation((_willReturn) => DeleteRestaurantOutput)
  @Role([UserRole.owner])
  async deleteRestaurant(
    @AuthUser() authUser: User,
    @Args('data')
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      authUser,
      deleteRestaurantInput,
    );
  }
}

@Resolver((_of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @ResolveField((_willReturn) => Number)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query((_willReturn) => AllCategoriesOutput)
  async allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query((_willReturn) => CategoryOutput)
  async category(
    @Args('data') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
