import { MailerService as NestJsMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { User } from '../user/user.entity';
import { SendMailOptions } from './interfaces';

@Injectable()
export class MailerService {
  private emailSender: string;

  constructor(
    private mailerService: NestJsMailerService,
    configService: ConfigService
  ) {
    this.emailSender = configService.get('smtp.from');
  }

  async send(data: SendMailOptions) {
    return this.mailerService.sendMail({ from: this.emailSender, ...data });
  }

  async sendUserAccountSetupEmail(otp: string, user: User) {
    const html = await this.getFileTemplate('account-setup', {
      userName: user.firstName,
      otp,
    });
    
    return this.send({
      to: user.email,
      subject: 'Complete Account Setup',
      html,
    }).catch(console.error);
  }

  async sendForgotPasswordEmail(
    { email , firstName }: User,
    accessToken: string
  ) {
    const url = `${process.env.PASSWORD_RESET_URL}=${accessToken}`;
    const html = await this.getFileTemplate('password-reset', {
      url,
      firstName
    });
    
    return this.send({
      to: email,
      subject: 'Password Reset Request',
      html,
    }).catch(console.error);
  }

  protected async getFileTemplate(
    name: string,
    templateData?: Record<string, any>
  ): Promise<string> {
    const templateBase = './templates';
    const filePath = path.join(__dirname, templateBase, `${name}.ejs`);

    if (fs.existsSync(filePath)) {
      return new Promise((res, rej) => {
        ejs.renderFile(filePath, templateData, (e, data) => {
          if (!e) {
            res(data);
          } else {
            rej(e);
          }
        });
      });
    }

    return undefined;
  }
}
