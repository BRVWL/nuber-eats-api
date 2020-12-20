import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from '../dto/allCategories.dto';
import { CategoryInput, CategoryOutput } from '../dto/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '../dto/createRestaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from '../dto/deleteRestaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantOutput,
} from '../dto/updateRestaurant.dto';
import { Category } from '../entities/category.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private restaurants: Repository<Restaurant>,
    private category: CategoryRepository,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find({ relations: ['category', 'user'] });
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant: Restaurant = await this.restaurants.create(
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

  async countRestaurants(category: Category): Promise<number> {
    try {
      return await this.restaurants.count({ category });
    } catch (error) {
      console.error(error);
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
}
