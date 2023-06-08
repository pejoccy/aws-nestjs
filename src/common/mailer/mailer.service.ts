import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { Account } from '../../account/account.entity';
import { SessionInvite } from '../../pacs/session/session-invite/session-invite.entity';
import { Session } from '../../pacs/session/session.entity';
import { SendMailOptions } from './interfaces';
import moment from 'moment';

@Injectable()
export class MailerService {
  private emailSender: string;
  private appLogoURL: string;

  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.get('sendGrid.apiKey'));
    const sender = configService.get('sendGrid.from');
    this.appLogoURL = `${configService.get('app.host')}/assets/logo.png`;
    this.emailSender = `${sender.name} <${sender.address}>`;
  }

  async send(data: SendMailOptions) {
    return sgMail.send({ from: this.emailSender, ...data }).then((resp) => {
      console.log(resp);

      return resp;
    });
  }

  async sendUserAccountSetupEmail(email: string, otp: string) {
    const html = await this.getFileTemplate('account-setup', {
      otp,
      appLogo: this.appLogoURL,
    });

    return this.send({
      to: email,
      subject: 'Complete Account Setup',
      html,
    }).catch((err) => console.log(JSON.stringify(err, null, 2)));
  }

  async sendForgotPasswordEmail({ email, ...account }: Account, otp: string) {
    const name =
      (account.patient &&
        `${account.patient.firstName} ${account.patient.lastName}`) ||
      (account.businessContact &&
        `${account.businessContact.firstName} ${account.businessContact.lastName}`) ||
      (account.specialist &&
        `${account.specialist.firstName} ${account.specialist.lastName}`);

    const html = await this.getFileTemplate('password-reset', {
      name,
      otp,
      appLogo: this.appLogoURL,
    });

    return this.send({
      to: email,
      subject: 'Reset Account Password',
      html,
    }).catch(console.dir);
  }

  async sendInviteCollaboratorEmail(
    email: string,
    inviteHash: string,
    { invitedBy, ...invitation }: SessionInvite,
  ) {
    const acceptInvitationURL = [
      this.configService.get('client.baseUrl'),
      '/library/invite',
      `?inviteCode=${inviteHash}&sessionId=${invitation.sessionId}`,
    ].join('');
    const inviter =
      invitedBy.businessContact?.business.name ||
      (invitedBy.specialist &&
        `${invitedBy.specialist.firstName} ${invitedBy.specialist.lastName}`) ||
      `${invitedBy.patient?.firstName} ${invitedBy.patient?.lastName}`;

    const html = await this.getFileTemplate('invite-collaborator', {
      inviter,
      inviteDate: moment(invitation.createdAt).format('llll'),
      sessionName: invitation.session.name,
      acceptInvitationURL,
      appLogo: this.appLogoURL,
    });

    return this.send({
      to: email,
      subject: 'Invitation to Collaborate on OrysX',
      html,
    }).catch(console.error);
  }

  async sendSessionShareLinkEmail(
    email: string,
    sessionShareLink: string,
    account: Account,
    session: Session,
  ) {
    const inviter =
      account.businessContact?.business.name ||
      (account.specialist &&
        `${account.specialist.firstName} ${account.specialist.lastName}`) ||
      `${account.patient?.firstName} ${account.patient?.lastName}`;

    const html = await this.getFileTemplate('share-session-link', {
      inviter,
      inviteDate: moment().format('llll'),
      sessionName: session.name,
      link: sessionShareLink,
      appLogo: this.appLogoURL,
    });

    return this.send({
      to: email,
      subject: 'Share Collaboration Session',
      html,
    }).catch(console.error);
  }

  protected async getFileTemplate(
    name: string,
    templateData?: Record<string, any>,
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
