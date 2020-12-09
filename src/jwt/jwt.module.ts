import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtOptions } from './interfaces/jwt.interface';
import { JwtService } from './services/jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options?: JwtOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [{ provide: 'options', useValue: options }, JwtService],
    };
  }
}
