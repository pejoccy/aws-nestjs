import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

const CUSTOM_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class AppUtilities {
  constructor(private configService: ConfigService) {}

  public generateOtp(length = 8): string {
    return Math.floor(Math.random() * Math.pow(10, length)).toString();
  }

  public generateShortCode(): string {
    const nanoid = customAlphabet(CUSTOM_CHARS, 10);
    return nanoid();
  }

  public generateUniqueKey(): string {
    return uuidv4();
  }

  public signMessage(message: string): string {
    return Base64.stringify(sha256(message));
  }

  public getSystemDate(): Date {
    return new Date();
  }

  public getAssetUrl(asset: string): string {
    return `${this.configService.get('app.host')}/assets/${asset}`;
  }

  public getApiUrl(uri = ''): string {
    return [
      this.configService.get('app.host'),
      this.configService.get('app.api.version'),
      uri,
    ].join('/');
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64'
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64'
  ): string {
    return Buffer.from(data, encoding).toString();
  }
}
