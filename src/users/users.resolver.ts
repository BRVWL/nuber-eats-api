import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserInput, UserOutput } from './dto/createUser.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UpdateUserDto, UpdateUserOutput } from './dto/updateUser.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';

import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Resolver((_of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_willReturn) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query((_willReturn) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    const { userId } = userProfileInput;
    try {
      return this.userService.findById(userId);
    } catch (error) {
      console.error(error);
    }
  }

  @Query((_willReturn) => [User])
  users(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Mutation((_willReturn) => UserOutput)
  async createUser(
    @Args('data') createUserDto: UserInput,
  ): Promise<UserOutput> {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation((_willReturn) => LoginOutput)
  async login(@Args('data') loginDto: LoginInput): Promise<LoginOutput> {
    const { email, password } = loginDto;
    try {
      return this.userService.login({ email, password });
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation((_willReturn) => UpdateUserOutput)
  async updateUser(
    @Args() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    try {
      return await this.userService.updateUser(updateUserDto);
    } catch (error) {
      console.error(error);
    }
  }
}
