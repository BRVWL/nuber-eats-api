import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '../dto/createRestaurant.dto';
import { UpdateRestaurantDto } from '../dto/updateRestaurant.dto';
import { Category } from '../entities/category.entity';
import { Restaurant } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private category: Repository<Category>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant: Restaurant = await this.restaurants.create(
        createRestaurantInput,
      );
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLocaleLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.category.findOne({ slug: categorySlug });
      if (!category) {
        const newCategory = await this.category.create({
          name: categoryName,
          slug: categorySlug,
        });
        category = await this.category.save(newCategory);
      }
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

  updateRestaurant(updateRestaurantDto: UpdateRestaurantDto) {
    const { id, data } = updateRestaurantDto;
    return this.restaurants.update(id, { ...data });
  }
}
