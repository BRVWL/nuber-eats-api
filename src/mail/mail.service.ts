import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import * as FormData from 'form-data';
import { MailOptions } from './mail.interface';

interface ITemplateVars {
  [key: string]: string;
}
@Injectable()
export class MailService {
  constructor(@Inject('options') private readonly options: MailOptions) {}
  private async sendEmail(
    to: string,
    subject: string,
    template: string,
    templateVars: ITemplateVars,
  ) {
    const form = new FormData();
    form.append('from', this.options.fromEmail);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template); // use saved template on mailgun
    Object.keys(templateVars).forEach((key) =>
      form.append(`v:${key}`, templateVars[key]),
    );
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic: ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: now i dont have ability to send mails to any email. For now can use only 'jindnbua@gmail.com in mail arg
  sendVerificationEmail(email, code: string) {
    this.sendEmail(email, 'Please verify your email', 'verify', {
      code,
      userName: email,
    });
  }
}
