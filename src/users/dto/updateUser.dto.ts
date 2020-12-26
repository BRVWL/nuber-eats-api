import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';
import { UserInput } from './createUser.dto';

@InputType()
export class UpdateUserInputType extends PartialType(UserInput) {}

@ArgsType()
export class UpdateUserDto {
  @Field((_type) => Number)
  id: number;

  @Field((_type) => UpdateUserInputType)
  data: UpdateUserInputType;
}

@ObjectType()
export class UpdateUserOutput extends MutationOutput {
  @Field((_type) => User, { nullable: true })
  user: User;
}
