import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((is) => Number)
  @PrimaryColumn()
  id: number;

  @Field((is) => String)
  @Column()
  name: string;

  @Field((is) => String)
  @Column()
  address: string;

  @Field((is) => Boolean)
  @Column()
  isVegan: boolean;
}
