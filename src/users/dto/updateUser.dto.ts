import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
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
