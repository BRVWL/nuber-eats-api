import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

// Using Entity obj for extending fields
@InputType()
export class LoginInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((_type) => String, { nullable: true })
  token: string;
}
