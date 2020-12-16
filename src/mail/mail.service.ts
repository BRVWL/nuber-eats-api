import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import * as FormData from 'form-data';
import { MailOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(@Inject('options') private readonly options: MailOptions) {}
  private async sendEmail(
    to = 'jindnbua@gmail.com',
    subject: string,
    template = 'verify',
    templateVars = {
      code: '',
      userName: '',
    },
  ) {
    const form = new FormData();
    form.append('from', this.options.fromEmail);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template); // use named template
    Object.keys(templateVars).forEach((key) =>
      form.append(`v:${key}`, templateVars[key]),
    );
    try {
      const response = await got.post(
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
}
