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
import { CreateAccountDto } from '../account/dto/create-account.dto';
import { Specialist } from '../account/specialist/specialist.entity';
import { AppUtilities } from '../app.utilities';
import { BaseService } from '../common/base/service';
import { 
  AuthTokenTypes,
  CachedAuthData,
  PG_DB_ERROR_CODES,
  UserRoles,
} from '../common/interfaces';
import { CacheService } from '../common/cache/cache.service';
import { MailerService } from '../common/mailer/mailer.service';
import {
  SpecializationService,
} from '../common/specialization/specialization.service';
import { SubscriptionService } from '../common/subscription/subscription.service';
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
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private subscriptionService: SubscriptionService,
    private cacheService: CacheService,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private accountService: AccountService,
    private businessService: BusinessService,
    private specializationService: SpecializationService
  ) {
    super();
  }

  public async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.accountRepository.findOne({ email });
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
        15 * 60 * 60 * 1000 // 15 mins
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
        'business',
        'subscription',
        'subscription.plan',
        'subscription.plan.permissions',
        'specialist',
        'specialist.specialization',
      ],
    });
    const passwordMatches = !!account && (await this.validatePassword(password, account));
    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!account.isVerified) {
      throw new UnauthorizedException('Account not verified!');
    }
    else if (!account.subscription) {
      account.subscription = await this
        .subscriptionService
        .setupDefaultSubscription(account);
    }
    const jwtExpiration = this.configService.get('jwt.signOptions.expiresIn');
    const expiresIn = new Date().getTime() + jwtExpiration;
    const accessToken = await this.setAuthTokenCache(
      AuthTokenTypes.AUTH,
      account
    );

    return {
      accessToken,
      expiresIn,
      user: {
        id: account.id,
        role: account.role,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        isVerified: account.isVerified,
        business: account.business || undefined,
        specialist: account.specialist || undefined,
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
    const user = await this.accountRepository.findOne({ where: { email }});
    if (user) {
      throw new NotAcceptableException(
        'An account with same email already exists!'
      );
    }
    
    const token = this.appUtilities.generateShortCode();
    const otp = this.appUtilities.generateOtp();
    let accountInitData: InitAccountDto = { email, password, userType };
    if (userType === UserRoles.BUSINESS) {
      accountInitData = { ...accountInitData, ...userDto };
    }
    await this.cacheService.set(
      token,
      {
        authType: AuthTokenTypes.SETUP,
        data: accountInitData,
        otp,
      },
      24 * 60 * 60 // 1 day
    );

    this.mailService.sendUserAccountSetupEmail(email, otp);

    return { token };
  }

  public async signUp({
    otp,
    token,
    business,
    specialist,
    userType,
    ...userDto
  }: CreateAccountDto & { userType: UserRoles }) {
    const queryRunner = await this.startTransaction();
    const initData = await this.verifyOtp(token, otp);
    if (
      initData.authType !== AuthTokenTypes.SETUP ||
      initData.data?.userType !== userType
    ) {
      throw new UnauthorizedException('Invalid sign up token/OTP!');
    }

    try {
      let businessId = undefined;
      const password = await this.hashPassword(initData.data?.password);
      if (userType === UserRoles.BUSINESS && !!business) {
        ({ id: businessId } = await this.businessService.create(business));
      }
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        userType: userRole,
      } = initData.data || {};

      const account = await this.accountRepository.save({
        firstName,
        lastName,
        email,
        phoneNumber,
        ...userDto,
        password,
        role: userRole,
        businessId,
        isVerified: true,
      });
      // setup default subscription
      await this.subscriptionService.setupDefaultSubscription(account);
      // clean up
      delete account.password;
      this.cacheService.remove(token);

      if (userType === UserRoles.SPECIALIST && !!specialist) {
        let specializationId = specialist.specializationId;
        if (!specializationId) {
          ({ id: specializationId } = await this.specializationService
            .setupSpecialization({ title: specialist.otherSpecialization }));
        }
        account.specialist = await this.specialistRepository.save({
          specializationId,
          accountId: account.id,
          category: specialist.category,
        });
      }

      return account;
    } catch (error) {
      if (error.code === PG_DB_ERROR_CODES.CONFLICT) {
        throw new NotAcceptableException(
          'An account with same email already exists!'
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async verifyTokenizedOtp(
    { token, otp }: AuthOtpDto
  ): Promise<CachedAuthData> {
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

  private async verifyOtp<T = any>(
    token: string,
    otp: string
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
    user: Account
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

  private async setAuthTokenCache(
    authType: AuthTokenTypes,
    cacheData?: any,
    ttl: number = this.configService.get<number>('jwt.signOptions.expiresIn')
  ) {
    let refreshTokenTtl = ttl;
    if (authType === AuthTokenTypes.AUTH) {
      refreshTokenTtl = this.configService.get<number>(
        'jwt.refreshToken.expiresIn'
      );
    }
    const token = this.generateJwtToken(
      { authType },
      { expiresIn: refreshTokenTtl }
    );
    const [, , cacheKey] = token.split('.');
    await this.cacheService.set(
      cacheKey,
      { data: cacheData, authType },
      ttl
    );

    return token;
  }
}
