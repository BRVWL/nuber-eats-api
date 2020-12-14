import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput, UserOutput } from '../dto/createUser.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { UpdateUserDto, UpdateUserOutput } from '../dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { JwtService } from 'src/jwt/services/jwt.service';
import { UserProfileOutput } from '../dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<UserOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        return {
          ok: false,
          user: null,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
        error: null,
      };
    } catch (error) {
      console.error(error);
    }
  }

  getAll(): Promise<User[]> {
    return this.users.find();
  }

  async createUser({ email, password, role }: UserInput): Promise<UserOutput> {
    try {
      const existingUser: User = await this.users.findOne({ email });
      if (existingUser) {
        return {
          ok: false,
          user: existingUser,
          error: 'User already exists',
        };
      }
      const newUser: User = await this.users.create({ email, password, role });
      const savedUser: User = await this.users.save(newUser);
      return {
        ok: true,
        user: savedUser,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        user: null,
        error,
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user: User = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          token: null,
          error: "User doesn't exist",
        };
      }
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          token: null,
          error: 'Wrong password',
        };
      }
      const token = await this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      return {
        ok: true,
        token,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        token: null,
        error,
      };
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserOutput> {
    const { id, data } = updateUserDto;
    const { email, password, role } = data;
    try {
      const user = await this.users.findOne({ id });
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      if (role) {
        user.role = role;
      }
      const editedUser = await this.users.save(user);
      return {
        ok: true,
        error: null,
        user: editedUser,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Error while update user',
        user: null,
      };
    }
  }
}
