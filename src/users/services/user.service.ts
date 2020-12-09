import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from '../dto/createUser.dto';
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
      const existingUser = await this.users.findOne({ email });
      if (existingUser) {
        return {
          ok: false,
          user: existingUser,
          error: 'User already exists',
        };
      }
      // create user and hash password
      const newUser: User = await this.users.create({ email, password, role });
      const savedUser = await this.users.save(newUser);
      return {
        ok: true,
        user: savedUser,
        error: null,
      };
    } catch (error) {
      console.error(error);
    }
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const { id, data } = updateUserDto;
    return this.users.update(id, { ...data });
  }
}
