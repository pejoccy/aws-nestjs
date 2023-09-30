import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { ICreateAccount } from '../account/dto/create-account.dto';
import { AppUtilities } from '../app.utilities';
import { BaseService } from '../common/base/service';
import {
  AuthTokenTypes,
  CachedAuthData,
  AccountTypes,
  AuthTokenOptions,
} from '../common/interfaces';
import { CacheService } from '../common/cache/cache.service';
import { MailerService } from '../common/mailer/mailer.service';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InitAccountDto } from './dto/init-account.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
    private mailService: MailerService,
    private accountService: AccountService,
  ) {
    super();
  }

  public async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.accountRepository.findOne({
      where: { email },
      relations: ['businessContact', 'patient', 'specialist'],
    });
    const token = AppUtilities.generateShortCode();
    if (user) {
      const otp = AppUtilities.generateOtp(6);
      await this.cacheService.set(
        token,
        {
          authType: AuthTokenTypes.RESET,
          data: { userId: user.id },
          otp,
        },
        15 * 60 * 60 * 1000, // 15 mins
      );

      // emit forgotPassword event
      this.mailService.sendForgotPasswordEmail(user, otp);
    }

    return { token };
  }

  public async signIn({ email, password }: SignInDto) {
    const account = await this.accountRepository.findOne({
      where: { email },
      relations: [
        'businessContact',
        'businessContact.business',
        'patient',
        'specialist',
        'specialist.specialization',
        'specialist.contractors',
        // 'subscription',
        // 'subscription.plan',
        // 'subscription.plan.permissions',
      ],
    });
    const passwordMatches =
      !!account && (await AppUtilities.validatePassword(password, account));
    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!account.isVerified) {
      throw new UnauthorizedException('Account not verified!');
    }
    const jwtExpiration = this.configService.get('jwt.signOptions.expiresIn');
    const refreshTokenTtl = this.configService.get(
      'jwt.refreshToken.expiresIn',
    );
    const expiresIn = new Date().getTime() + jwtExpiration;
    const accessToken = await this.setAuthTokenCache({
      authType: AuthTokenTypes.AUTH,
      cacheData: account,
      ttl: jwtExpiration,
      refreshTokenTtl,
      autoRefreshToken: true,
    });

    return {
      accessToken,
      expiresIn,
      user: {
        id: account.id,
        role: account.type,
        ...account.patient,
        ...account.specialist,
        ...account.businessContact,
        isVerified: account.isVerified,
        // subscription: account.subscription,
      },
    };
  }

  public async initiateAccount({
    email,
    password,
    userType,
    ...userDto
  }: InitAccountDto): Promise<any> {
    const user = await this.accountRepository.findOne({ where: { email } });
    if (user) {
      throw new NotAcceptableException(
        'An account with same email already exists!',
      );
    }

    const token = AppUtilities.generateShortCode();
    const otp = AppUtilities.generateOtp();
    let accountInitData: InitAccountDto = { email, password, userType };
    if (userType === AccountTypes.BUSINESS) {
      accountInitData = { ...accountInitData, ...userDto };
    }
    await this.cacheService.set(
      token,
      {
        authType: AuthTokenTypes.SETUP,
        data: accountInitData,
        otp,
      },
      24 * 60 * 60, // 1 day
    );

    this.mailService.sendUserAccountSetupEmail(email, otp);

    return { token };
  }

  public async signUp({
    otp,
    token,
    business,
    specialist,
    patient,
    userType,
  }: ICreateAccount & { userType: AccountTypes }) {
    const initData = await this.verifyOtp(token, otp);
    if (
      initData.authType !== AuthTokenTypes.SETUP ||
      initData.data?.userType !== userType
    ) {
      throw new UnauthorizedException('Invalid sign up token/OTP!');
    }
    const { account } = await this.accountService.setupAccount({
      userType,
      password: initData.data.password,
      email: initData.data.email,
      business: { ...business, contact: initData.data },
      specialist,
      patient,
    });

    // clean up
    this.cacheService.remove(token);

    return account;
  }

  public async verifyTokenizedOtp({
    token,
    otp,
  }: AuthOtpDto): Promise<CachedAuthData> {
    const data = await this.verifyOtp(token, otp);
    if (
      ![AuthTokenTypes.RESET, AuthTokenTypes.SETUP].includes(data?.authType)
    ) {
      throw new UnauthorizedException('Invalid reset token/OTP');
    }

    return data;
  }

  public async resetPassword(item: ResetPasswordDto) {
    const authToken = await this.verifyTokenizedOtp(item);
    const password = await AppUtilities.hashPassword(item.password);
    await this.accountService.changePassword(authToken.data?.userId, password);
  }

  public async setAuthTokenCache({
    authType,
    cacheData,
    ttl,
    refreshTokenTtl,
    cacheKey,
    autoRefreshToken,
  }: AuthTokenOptions) {
    refreshTokenTtl = refreshTokenTtl || ttl;
    const token = this.generateJwtToken(
      { authType },
      { ...(refreshTokenTtl && { expiresIn: refreshTokenTtl }) },
    );
    if (!cacheKey) {
      [, , cacheKey] = token.split('.');
    }
    await this.cacheService.set(
      cacheKey,
      { data: cacheData, authType, autoRefreshToken },
      ttl,
    );

    return token;
  }

  private async verifyOtp<T = any>(
    token: string,
    otp: string,
  ): Promise<CachedAuthData<T>> {
    const data = await this.cacheService.get<CachedAuthData<T>>(token);
    if (!data || data.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return data;
  }

  private generateJwtToken(payload: any, options?: JwtSignOptions): string {
    options = {
      expiresIn: '15m',
      ...options,
      secret: this.configService.get('jwt.secret'),
    };

    return this.jwtService.sign(payload, options);
  }
}
