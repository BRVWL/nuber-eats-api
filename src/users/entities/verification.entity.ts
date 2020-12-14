import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((_is) => String)
  code: string;

  @OneToOne((_type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = Math.random().toString(36).substring(2);
  }
}
