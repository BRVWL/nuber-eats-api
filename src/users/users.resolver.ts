import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { UserInput, UserOutput } from './dto/createUser.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UpdateUserDto, UpdateUserOutput } from './dto/updateUser.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';

import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Resolver((_of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((_willReturn) => User)
  @Role(['any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Role(['any'])
  @Query((_willReturn) => UserProfileOutput)
  userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    const { userId } = userProfileInput;
    return this.userService.findById(userId);
  }

  @Role(['any'])
  @Query((_willReturn) => [User])
  users(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Mutation((_willReturn) => UserOutput)
  createUser(@Args('data') createUserDto: UserInput): Promise<UserOutput> {
    return this.userService.createUser(createUserDto);
  }

  @Mutation((_willReturn) => VerifyEmailOutput)
  verifyEmail(
    @Args('data') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    const { code } = verifyEmailInput;
    return this.userService.verifyEmail(code);
  }

  @Mutation((_willReturn) => LoginOutput)
  login(@Args('data') loginDto: LoginInput): Promise<LoginOutput> {
    const { email, password } = loginDto;
    return this.userService.login({ email, password });
  }

  @Role(['any'])
  @Mutation((_willReturn) => UpdateUserOutput)
  updateUser(@Args() updateUserDto: UpdateUserDto): Promise<UpdateUserOutput> {
    return this.userService.updateUser(updateUserDto);
  }
}
