import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '../dto/createRestaurant.dto';
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
}
