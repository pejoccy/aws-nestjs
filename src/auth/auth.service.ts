import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { BusinessService } from '../account/business/business.service';
import { ICreateAccount } from '../account/dto/create-account.dto';
import { PatientService } from '../account/patient/patient.service';
import { SpecialistService } from '../account/specialist/specialist.service';
import { AppUtilities } from '../app.utilities';
import { BaseService } from '../common/base/service';
import {
  AuthTokenTypes,
  CachedAuthData,
  PG_DB_ERROR_CODES,
  AccountTypes,
  CommsProviders,
  AuthTokenOptions,
} from '../common/interfaces';
import { CacheService } from '../common/cache/cache.service';
import { MailerService } from '../common/mailer/mailer.service';
import { SubscriptionService } from '../common/subscription/subscription.service';
import { ChimeCommsProvider } from '../comms/providers/chime';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InitAccountDto } from './dto/init-account.dto';
import { v4 } from 'uuid';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private subscriptionService: SubscriptionService,
    private cacheService: CacheService,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private accountService: AccountService,
    private businessService: BusinessService,
    private specialistService: SpecialistService,
    private patientService: PatientService,
    private commsProvider: ChimeCommsProvider,
  ) {
    super();
  }

  public async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.accountRepository.findOne({
      where: { email },
      relations: ['businessContact', 'patient', 'specialist'],
    });
    const token = this.appUtilities.generateShortCode();
    if (user) {
      const otp = this.appUtilities.generateOtp();
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
        // 'subscription',
        // 'subscription.plan',
        // 'subscription.plan.permissions',
      ],
    });
    const passwordMatches =
      !!account && (await this.validatePassword(password, account));
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
        role: account.role,
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

    const token = this.appUtilities.generateShortCode();
    const otp = this.appUtilities.generateOtp();
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

    this.mailService.sendUserAccountSetupEmail(email, otp, user);

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
    const queryRunner = await this.startTransaction();
    const initData = await this.verifyOtp(token, otp);
    if (
      initData.authType !== AuthTokenTypes.SETUP ||
      initData.data?.userType !== userType
    ) {
      throw new UnauthorizedException('Invalid sign up token/OTP!');
    }

    try {
      const password = await this.hashPassword(initData.data?.password);
      const { email, userType: userRole, ...userDto } = initData.data || {};

      const alias = v4();
      // setup Account Comms
      const identity = await this.commsProvider.createIdentity(alias, email);
      const account = await this.accountRepository.save({
        email,
        alias,
        password,
        role: userRole,
        isVerified: true,
        comms: {
          [CommsProviders.AWS_CHIME]: {
            identity: identity.AppInstanceUserArn,
          },
        },
      });
      // setup default subscription
      // await this.subscriptionService.setupDefaultSubscription(account);
      if (userType === AccountTypes.BUSINESS && !!business) {
        business = await this.businessService.setup(business, {
          ...userDto,
          email,
          accountId: account.id,
        });
      } else if (userType === AccountTypes.SPECIALIST && !!specialist) {
        specialist = await this.specialistService.create({
          ...specialist,
          email,
          accountId: account.id,
        });
      } else if (userType === AccountTypes.PATIENT && !!patient) {
        patient = await this.patientService.create({
          ...patient,
          email,
          accountId: account.id,
        });
      } else {
        throw new NotAcceptableException('Invalid user type and data!');
      }

      // clean up
      delete account.password;
      this.cacheService.remove(token);

      return account;
    } catch (error) {
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException(
          'An account with same email already exists!',
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
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
    const password = await this.hashPassword(item.password);
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

  private async hashPassword(password: string, rounds = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  private async validatePassword(
    password: string,
    user: Account,
  ): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
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
