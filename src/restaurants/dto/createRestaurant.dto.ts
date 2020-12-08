import { Field, ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(3, 30)
  name: string;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;
}
