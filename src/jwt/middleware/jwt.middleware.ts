import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserOutput } from 'src/users/dto/createUser.dto';
import { UserService } from 'src/users/services/user.service';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = await this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user }: UserOutput = await this.userService.findById(
          decoded['id'],
        );
        // Provide user to request context
        req['user'] = user;
      }
    }
    next();
  }
}
