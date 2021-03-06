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
import { CreateDishInput, CreateDishOutput } from './dto/createDish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/createRestaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/deleteDish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/deleteRestaurant.dto';
import { EditDishInput, EditDishOutput } from './dto/editDish.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/searchRestaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantOutput,
} from './dto/updateRestaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './services/restaurants.service';

@Resolver((_of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Query((_willReturn) => RestaurantOutput)
  @Role(['any'])
  async getRestaurant(
    @Args('data') restaurantInput: RestaurantInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.getOne(restaurantInput);
  }

  @Query((_willReturn) => RestaurantsOutput)
  @Role(['any'])
  async restaurants(
    @Args('data') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.getAll(restaurantsInput);
  }

  @Query((_willReturn) => SearchRestaurantOutput)
  @Role(['any'])
  async searchRestaurant(
    @Args('data') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
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
  async getCategory(
    @Args('data') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation((willReturn) => CreateDishOutput)
  @Role([UserRole.owner])
  async createDish(
    @AuthUser() owner: User,
    @Args('data') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDishByRestaurantId(
      owner,
      createDishInput,
    );
  }

  @Mutation((willReturn) => DeleteDishOutput)
  @Role([UserRole.owner])
  async deleteDish(
    @AuthUser() owner: User,
    @Args('data') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDishById(owner, deleteDishInput);
  }

  @Mutation((willReturn) => EditDishOutput)
  @Role([UserRole.owner])
  async editDish(
    @AuthUser() owner: User,
    @Args('data') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDishById(owner, editDishInput);
  }
}
