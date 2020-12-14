import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput, UserOutput } from '../dto/createUser.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { UpdateUserDto, UpdateUserOutput } from '../dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { JwtService } from 'src/jwt/services/jwt.service';
import { Verification } from '../entities/verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,

    @InjectRepository(Verification)
    private verification: Repository<Verification>,

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
      // Save user
      const savedUser: User = await this.users.save(newUser);
      // Email verification
      const verification = await this.verification.create({ user: savedUser });
      await this.verification.save(verification);
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

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verified = await this.verification.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verified) {
        verified.user.verified = true;
        await this.users.save(verified.user);
        await this.verification.delete({ id: verified.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user: User = await this.users.findOne(
        { email },
        { select: ['id', 'password', 'email', 'role'] },
      );
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
        // change mail
        user.email = email;
        // unverified
        user.verified = false;
        // create verification code
        const verification = await this.verification.create({ user });
        await this.verification.save(verification);
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
