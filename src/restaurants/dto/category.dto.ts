import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class CategoryInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends MutationOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}
