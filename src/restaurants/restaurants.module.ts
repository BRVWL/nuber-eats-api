import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantsResolver, CategoryResolver } from './restaurants.resolver';
import { RestaurantsService } from './services/restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantsResolver, RestaurantsService, CategoryResolver],
})
export class RestaurantsModule {}
