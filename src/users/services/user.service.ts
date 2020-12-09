import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserInput, CreateUserOutput } from '../dto/createUser.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';

import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  getAll(): Promise<User[]> {
    return this.users.find();
  }

  async createUser({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    // check that email doesn't exist
    try {
      const existingUser: User = await this.users.findOne({ email });
      if (existingUser) {
        return {
          ok: false,
          user: existingUser,
          error: 'User already exists',
        };
      }
      // create user and hash password
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
      const token = await jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1h',
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

  updateUser(updateUserDto: UpdateUserDto) {
    const { id, data } = updateUserDto;
    return this.users.update(id, { ...data });
  }
}
