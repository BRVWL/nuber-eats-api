import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Order } from 'src/orders/entities/order.entity';

export enum UserRole {
  client = 'client',
  owner = 'owner',
  delivery = 'delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((_is) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((_is) => Boolean)
  @Column({ default: false })
  verified: boolean;

  @Field((_is) => String)
  @Column({ select: false })
  @IsString()
  @Length(8)
  password: string;

  @Field((_is) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((_is) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.user)
  restaurants: Restaurant[];

  @Field((_is) => [Order])
  @OneToMany((type) => Order, (order) => order.customer)
  orders: Order[];

  @Field((_is) => [Order])
  @OneToMany((type) => Order, (order) => order.deliver)
  rides: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashThePassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
