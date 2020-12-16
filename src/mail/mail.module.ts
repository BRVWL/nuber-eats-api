import { DynamicModule, Module } from '@nestjs/common';
import { MailOptions } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
  static forRoot(options: MailOptions): DynamicModule {
    return {
      module: MailModule,
      exports: [MailService],
      providers: [{ provide: 'options', useValue: options }, MailService],
    };
  }
}
