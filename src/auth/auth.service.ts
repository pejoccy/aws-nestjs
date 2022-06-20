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
import { AppUtilities } from '../app.utilities';
import { BaseService } from '../common/base/service';
import { AuthTokenTypes, CachedAuthData, UserRole } from '../common/interfaces';
import { Business } from '../account/business/business.entity';
import { CacheService } from '../common/cache/cache.service';
import { MailerService } from '../common/mailer/mailer.service';
import { CreateAccountDto } from '../account/dto/create-account.dto';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
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
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private accountService: AccountService
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
      relations: ['business'],
    });
    const passwordMatches = !!account && (await this.validatePassword(password, account));
    if (!account || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!account.isVerified) {
      throw new UnauthorizedException('Account not verified!');
    }

    const accessToken = this.generateJwtToken(
      { email, id: account.id },
      { expiresIn: this.configService.get('jwt.signOptions.expiresIn') }
    );

    return {
      accessToken,
      expiryTime: this.configService.get('jwt.signOptions.expiresIn'),
      user: {
        id: account.id,
        role: account.role,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        isVerified: account.isVerified,
        business: account.business,
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
    if (userType === UserRole.BUSINESS) {
      accountInitData = { ...accountInitData, ...userDto };
    }
    await this.cacheService.set(
      token,
      {
        authType: AuthTokenTypes.SETUP,
        data: accountInitData,
        otp,
      },
      7 * 24 * 60 * 60 // 7 day
    );

    this.mailService.sendUserAccountSetupEmail(email, otp);

    return { token };
  }

  public async signUp({
    otp,
    token,
    business,
    userType,
    ...userDto
  }: CreateAccountDto & { userType: UserRole }) {
    const queryRunner = await this.startTransaction();
    const initData = await this.verifyOtp(token, otp);
    console.log(initData.data);
    if (
      initData.authType !== AuthTokenTypes.SETUP ||
      initData.data?.userType !== userType
    ) {
      throw new UnauthorizedException('Invalid sign up token/OTP!');
    }

    try {
      let businessId = undefined;
      const password = await this.hashPassword(initData.data?.password);
      if (userType === UserRole.BUSINESS && !!business) {
        let mBusiness = await this
          .businessRepository
          .createQueryBuilder('business')
          .where(
            "LOWER(business.name) = LOWER(:name)",
            { name: business.name }
          )
          .getOne();
        if (mBusiness) {
          throw new NotAcceptableException('Business name already exists!');
        }
        mBusiness = await this.businessRepository.save(business);
        console.log(mBusiness);
        businessId = mBusiness.id;
      }
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        userType: userRole,
      } = initData.data || {};

      const user = await this.accountRepository.save({
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
      delete user.password;
      this.cacheService.remove(token);

      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new NotAcceptableException(
          'An account with same email already exists!'
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async verifyPasswordResetOtp(
    { token, otp }: AuthOtpDto
  ): Promise<CachedAuthData> {
    const data = await this.verifyOtp(token, otp);
    if (data?.authType !== AuthTokenTypes.RESET) {
      throw new UnauthorizedException('Invalid reset token/OTP');
    }

    return data;
  }

  public async resetPassword(item: ResetPasswordDto) {
   const authToken = await this.verifyPasswordResetOtp(item);
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
}
