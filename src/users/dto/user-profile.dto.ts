import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field((_type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field((_type) => User, { nullable: true })
  user: User;
}
