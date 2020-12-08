import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field((is) => Number)
  id: number;

  @Field((is) => String)
  name: string;

  @Field((is) => String)
  address: string;

  @Field((is) => Boolean)
  isVegan: boolean;
}
