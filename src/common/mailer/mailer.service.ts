import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { Account } from '../../account/account.entity';
import { SendMailOptions } from './interfaces';

@Injectable()
export class MailerService {
  private emailSender: string;

  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.get('sendGrid.apiKey'));
    const sender = configService.get('sendGrid.from');
    this.emailSender = `${sender.name} <${sender.address}>`;
  }

  async send(data: SendMailOptions) {
    return sgMail
      .send({ from: this.emailSender, ...data })
      .then(resp => {
        console.log(resp);

        return resp;
      });
  }

  async sendUserAccountSetupEmail(email: string, otp: string) {
    const html = await this.getFileTemplate('account-setup', { otp });
    
    return this.send({
      to: email,
      subject: 'Complete Account Setup',
      html,
    }).catch(err => console.log(JSON.stringify(err, null, 2)));
  }

  async sendForgotPasswordEmail(
    { email }: Account,
    otp: string
  ) {
    const html = await this.getFileTemplate('password-reset', { otp });
    
    return this.send({
      to: email,
      subject: 'Reset Account Password',
      html,
    }).catch(console.dir);
  }

  async sendInviteCollaboratorEmail(
    email: string,
    inviteHash: string
  ) {
    const acceptInvitationURL = this.configService.get(
      'client.emailUrls.sessionCollaboratorInvite'
    );
    const html = await this.getFileTemplate('invite-collaborator', {
      acceptInvitationURL: `${acceptInvitationURL}?hash=${inviteHash}`,
    });
    
    return this.send({
      to: email,
      subject: 'Invitation to Collaborate on Orysx',
      html,
    }).catch(console.dir);
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
