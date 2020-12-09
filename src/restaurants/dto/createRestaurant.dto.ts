import { Field, ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field((_type) => String)
  @IsString()
  @Length(3, 30)
  name: string;

  @Field((_type) => String)
  @IsString()
  address: string;

  @Field((_type) => Boolean)
  @IsBoolean()
  isVegan: boolean;
}
