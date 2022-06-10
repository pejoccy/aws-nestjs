import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMSProvider, SMSProviders } from '../interfaces';
import { DotGoSMSProvider } from './dotGo';
import { HollaTagsSMSProvider } from './hollaTags';

@Injectable()
export class SmsProviderFactory {
  constructor(
    private configService: ConfigService,
    private dotGoProvider: DotGoSMSProvider,
    private hollaTagsProvider: HollaTagsSMSProvider
  ) {}

  public getInstance(): SMSProvider {
    return this.provide(
      this.configService.get('messaging.provider.sms', SMSProviders.DOT_GO)
    );
  }

  public provide(id: SMSProviders): SMSProvider {
    switch (id) {
      case SMSProviders.DOT_GO:
        return this.dotGoProvider;
      default:
        return this.hollaTagsProvider;
    }
  }
}
