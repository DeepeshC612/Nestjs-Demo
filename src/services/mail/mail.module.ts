import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { getEnv } from "../../constant/environment";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
       host: getEnv("SMTP_HOST"),
       port: +getEnv('smtp_port'),
        auth: {
          user: getEnv('smtp_username'),
          pass: getEnv('smtp_password'),
        },
      },
      defaults: {
        from: getEnv('smtp_from_email'),
      },
      template: {
        dir: join(__dirname, '..','templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
