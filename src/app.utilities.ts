import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { customAlphabet } from 'nanoid';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './account/account.entity';

const CUSTOM_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class AppUtilities {
  constructor(private configService: ConfigService) {}

  public static generateOtp(length = 4): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  public static generateShortCode(length = 10): string {
    const nanoid = customAlphabet(CUSTOM_CHARS, length);
    return nanoid();
  }

  public static generateUniqueKey(): string {
    return uuidv4();
  }

  public static signMessage(message: string): string {
    return Base64.stringify(sha256(message));
  }

  public static getSystemDate(): Date {
    return new Date();
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }

  static async hashPassword(password: string, rounds = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  static async validatePassword(
    password: string,
    user: Account,
  ): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  public static getFileExt(file: Express.Multer.File) {
    const [, ...fileExtFromNameArr] = String(file.originalname).split('.');

    return (
      mime.extension(file.mimetype) ||
      (fileExtFromNameArr.length &&
        fileExtFromNameArr[fileExtFromNameArr.length - 1]) ||
      undefined
    );
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
}
