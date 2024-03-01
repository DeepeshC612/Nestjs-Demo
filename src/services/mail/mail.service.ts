import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from './../../models/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string, type: string) {
    try {
      let context = {};
      if(type == 'reset-pass') {
        context['email'] = user?.email;
      } else {
          const url = `http://localhost:3000/auth?token=${token}`;
          context['name'] = user?.name;
          context['url'] = url
        }
        await this.mailerService.sendMail({
          to: user.email,
          subject: type == 'reset-pass' ? 'Reset password confirmation' : 'Please confirm your email',
          template: type == 'reset-pass' ? './password-reset-confirmation' : './confirmation',
          context: context
        });
    } catch (err) {
        console.log("mail error", err)
    }
  }
  async sendResetPasswordLink(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;
    try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset password',
          template: './reset-password',
          context: {
            email: email,
            url,
          },
        });
    } catch (err) {
        console.log("mail error", err)
    }
  }
}
