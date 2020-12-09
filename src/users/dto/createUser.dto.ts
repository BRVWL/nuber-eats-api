import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

// Using Entity obj for extending fields
@InputType()
export class CreateUserInput extends PickType(
  User,
  ['email', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class CreateUserOutput {
  @Field((_type) => String, { nullable: true })
  error: string;

  @Field((_type) => Boolean)
  ok: boolean;

  @Field((_type) => User, { nullable: true })
  user: User;
}
