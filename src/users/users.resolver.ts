import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dto/createUser.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Resolver((_of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_willReturn) => [User])
  users(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Mutation((_willReturn) => CreateUserOutput)
  async createUser(
    @Args('data') createUserDto: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation((_willReturn) => LoginOutput)
  async login(@Args('data') loginDto: LoginInput): Promise<LoginOutput> {
    const { email, password } = loginDto;
    try {
      return await this.userService.login({ email, password });
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation((_willReturn) => Boolean)
  async updateUser(@Args() updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      await this.userService.updateUser(updateUserDto);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
