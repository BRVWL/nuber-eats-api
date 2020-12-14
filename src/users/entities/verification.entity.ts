import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Verificarion extends CoreEntity {
  @Column()
  @Field((_is) => String)
  code: string;

  @OneToOne((_type) => User)
  @JoinColumn()
  user: User;
}
