import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
  client = 'client',
  owner = 'owner',
  delivery = 'delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((_is) => String)
  @Column()
  @IsString()
  email: string;

  @Field((_is) => String)
  @Column()
  @IsString()
  password: string;

  @Field((_is) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsString()
  role: UserRole;

  @BeforeInsert()
  async hashThePassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
