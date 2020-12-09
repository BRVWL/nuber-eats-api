import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtOptions } from '../interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(@Inject('options') private readonly options: JwtOptions) {}

  async sign(payload) {
    return await jwt.sign(payload, this.options.privateKey);
  }
}
