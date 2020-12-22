import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput, UserOutput } from '../dto/createUser.dto';
import { LoginInput, LoginOutput } from '../dto/login.dto';
import { UpdateUserDto, UpdateUserOutput } from '../dto/updateUser.dto';
import { User } from '../entities/user.entity';
import { JwtService } from 'src/jwt/services/jwt.service';
import { Verification } from '../entities/verification.entity';
import { VerifyEmailOutput } from '../dto/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,

    @InjectRepository(Verification)
    private verification: Repository<Verification>,

    private jwtService: JwtService,

    private mailService: MailService,
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

  async getAll(): Promise<User[]> {
    return this.users.find();
  }

  async createUser({ email, password, role }: UserInput): Promise<UserOutput> {
    try {
      const existingUser: User = await this.users.findOne({ email });
      if (existingUser) {
        return {
          ok: false,
          user: null,
          error: 'User already exists',
        };
      }
      const _user: User = this.users.create({ email, password, role });
      // Save user
      const user: User = await this.users.save(_user);
      // Email verification
      const _verification = this.verification.create({ user });
      const verification = await this.verification.save(_verification);
      this.mailService.sendVerificationEmail(user.email, verification.code);
      return {
        ok: true,
        user,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        user: null,
        error: 'Can not create a user',
      };
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserOutput> {
    const { id, data } = updateUserDto;
    const { email, password, role } = data;
    try {
      const _user = await this.users.findOne({ id });
      if (email) {
        // change mail
        _user.email = email;
        // unverified
        _user.verified = false;
        // create verification code
        const _verification = this.verification.create({ user: _user });
        const verification = await this.verification.save(_verification);
        this.mailService.sendVerificationEmail(_user.email, verification.code);
      }
      if (password) {
        _user.password = password;
      }
      if (role) {
        _user.role = role;
      }
      const user = await this.users.save(_user);
      return {
        ok: true,
        error: null,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Error while update user',
        user: null,
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      if (code) {
        const verified = await this.verification.findOne(
          { code },
          { relations: ['user'] },
        );
        if (verified) {
          verified.user.verified = true;
          await this.users.save(verified.user);
          await this.verification.delete({ id: verified.id });
          return {
            ok: true,
            error: null,
          };
        }
      }
      return {
        ok: false,
        error: "User doesn't verified",
      };
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
}
