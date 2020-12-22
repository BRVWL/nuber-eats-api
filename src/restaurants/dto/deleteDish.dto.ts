import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteDishInput {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class DeleteDishOutput extends MutationOutput {}
