import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

// Using Entity obj for extending fields
@InputType()
export class CreateUserInput extends PickType(
  User,
  ['email', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class CreateUserOutput extends MutationOutput {
  @Field((_type) => User, { nullable: true })
  user: User;
}
