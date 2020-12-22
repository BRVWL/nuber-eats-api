import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from '../dto/allCategories.dto';
import { CategoryInput, CategoryOutput } from '../dto/category.dto';
import { CreateDishInput, CreateDishOutput } from '../dto/createDish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '../dto/createRestaurant.dto';
import { DeleteDishInput } from '../dto/deleteDish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from '../dto/deleteRestaurant.dto';
import { EditDishInput, EditDishOutput } from '../dto/editDish.dto';
import { RestaurantInput, RestaurantOutput } from '../dto/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from '../dto/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from '../dto/searchRestaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantOutput,
} from '../dto/updateRestaurant.dto';
import { Category } from '../entities/category.entity';
import { Dish } from '../entities/dish.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private restaurants: Repository<Restaurant>,
    @InjectRepository(Dish) private dishes: Repository<Dish>,
    private category: CategoryRepository,
  ) {}

  async getOne(restaurantInput: RestaurantInput): Promise<RestaurantOutput> {
    const { restaurantId } = restaurantInput;
    try {
      const restaurant = await this.restaurants.findOne(
        { id: restaurantId },
        { relations: ['menu'] },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Can not find restaurant',
        };
      }
      return {
        ok: true,
        error: null,
        restaurant,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getAll(restaurantsInput: RestaurantsInput): Promise<RestaurantsOutput> {
    const { page } = restaurantsInput;
    try {
      const [restaurants, totalItems] = await this.restaurants.findAndCount({
        take: 25,
        skip: (page - 1) * 25,
      });
      if (!restaurants) {
        return {
          ok: false,
          error: 'Can not find restaurants',
        };
      }
      return {
        ok: true,
        error: null,
        restaurants,
        totalPages: Math.ceil(totalItems / 25),
      };
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: move copy past code (pagination stuff) to custom repository
  async searchRestaurantByName(
    searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    const { page, query } = searchRestaurantInput;
    try {
      const [restaurants, totalItems] = await this.restaurants.findAndCount({
        where: {
          // name: ILike(`%${query}%`),
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      if (!restaurants) {
        return {
          ok: false,
          error: 'Can not find restaurants',
        };
      }
      return {
        ok: true,
        error: null,
        restaurants,
        totalPages: Math.ceil(totalItems / 25),
      };
    } catch (error) {
      console.error(error);
    }
  }

  async countRestaurants(category: Category): Promise<number> {
    try {
      return await this.restaurants.count({ category });
    } catch (error) {
      console.error(error);
    }
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant: Restaurant = this.restaurants.create(
        createRestaurantInput,
      );
      const category = this.category.getOrCreateCategory(
        createRestaurantInput.categoryName,
      );
      const restaurant = await this.restaurants.save({
        user: owner,
        category,
        ...newRestaurant,
      });
      return {
        ok: true,
        restaurant,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        restaurant: null,
        error: 'Can not ctreat restaurant',
      };
    }
  }

  async updateRestaurant(
    owner: User,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<UpdateRestaurantOutput> {
    const { id, data } = updateRestaurantDto;
    try {
      const restaurant = await this.restaurants.findOne(
        { id },
        { relations: ['category', 'user'] },
      );
      if (!restaurant) {
        return {
          ok: false,
          restaurant: null,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          restaurant: null,
          error: 'Only owner can edit this restaurant',
        };
      }
      let category: Category = null;
      if (data.categoryName) {
        category = await this.category.getOrCreateCategory(data.categoryName);
      }
      const newRestaurant = await this.restaurants.save({
        id,
        ...data,
        ...(category && { category }),
      });
      return {
        ok: true,
        restaurant: newRestaurant,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        restaurant: null,
        error: 'Can not update restaurant',
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    const { restaurantId } = deleteRestaurantInput;
    try {
      const restaurant = await this.restaurants.findOne(
        { id: restaurantId },
        { relations: ['category', 'user'] },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          error: 'Only owner can delete this restaurant',
        };
      }
      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.category.find();
      return {
        ok: true,
        error: null,
        categories,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Can not find categories',
        categories: null,
      };
    }
  }

  async findCategoryBySlug(
    categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    const { slug, page } = categoryInput;
    try {
      const category = await this.category.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Can not find categories',
        };
      }
      const restaurants = await this.restaurants.find({
        where: { category },
        take: 25,
        skip: (page - 1) * 25,
      });
      const countOfRestaurants = await this.countRestaurants(category);
      return {
        ok: true,
        error: null,
        category: {
          restaurants,
          ...category,
        },
        totalPages: Math.ceil(countOfRestaurants / 25),
      };
    } catch (error) {
      console.error(error);
    }
  }

  async createDishByRestaurantId(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    const { restaurantId } = createDishInput;
    try {
      const restaurant = await this.restaurants.findOne({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Can not find the restaurant',
        };
      }
      if (owner.id !== restaurant.userId) {
        return {
          ok: false,
          error: 'You can not create the dish in this not own restaurant',
        };
      }
      const _dish = this.dishes.create({ ...createDishInput, restaurant });
      const dish = await this.dishes.save(_dish);
      if (!dish) {
        return {
          ok: false,
          error: 'Can not save the dish',
        };
      }
      return {
        ok: true,
        error: null,
        dish,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async editDishById(
    owner: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    const { dishId } = editDishInput;
    try {
      const dish = await this.dishes.findOne(
        { id: dishId },
        { relations: ['restaurant'] },
      );
      if (!dish) {
        return {
          ok: false,
          error: 'Can not find the dish with provided id',
        };
      }
      if (owner.id !== dish.restaurant.userId) {
        return {
          ok: false,
          error: 'Only owner can delete this dish',
        };
      }
      await this.dishes.save({
        id: dishId,
        ...editDishInput,
      });
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDishById(owner: User, { id }: DeleteDishInput) {
    try {
      const dish = await this.dishes.findOne({ id });
      if (!dish) {
        return {
          ok: false,
          error: 'Can not find the dish with provided id',
        };
      }
      if (owner.id !== dish.restaurant.userId) {
        return {
          ok: false,
          error: 'Only owner can delete this dish',
        };
      }
      await this.dishes.delete(id);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
