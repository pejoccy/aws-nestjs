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
import { AuthTokenTypes, CachedAuthToken, UserRole } from '../common/interfaces';
import { Business } from '../account/business/business.entity';
import { CacheService } from '../common/cache/cache.service';
import { MailerService } from '../common/mailer/mailer.service';
import { CreateUserDto } from '../account/dto/create-user.dto';
import { Account } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';

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
    private userService: AccountService
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
          userId: user.id,
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
    const user = await this.accountRepository.findOne({ where: { email } });
    const isVerified = !!user && (await this.validatePassword(password, user));
    if (!user || !isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateJwtToken(
      { email, id: user.id },
      { expiresIn: this.configService.get('jwt.signOptions.expiresIn') }
    );

    const profile = {}

    return {
      accessToken,
      expiryTime: this.configService.get('jwt.signOptions.expiresIn'),
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
      },
      profile,
    };
  }

  public async signUp({
    email,
    userType,
    business,
    ...userDto
  }: CreateUserDto): Promise<any> {
    const queryRunner = await this.startTransaction();
    try {
      let businessId = undefined;
      if (userType === UserRole.BUSINESS && !!business) {
        let mBusiness = await this.businessRepository.save(business);
        businessId = mBusiness.id;
      }
      const user = await this.accountRepository.save({
        ...userDto,
        email,
        role: userType,
        businessId,
      });
      
      const token = this.appUtilities.generateShortCode();
      const otp = this.appUtilities.generateOtp();
      await this.cacheService.set(
        token,
        {
          authType: AuthTokenTypes.RESET,
          userId: user.id,
          otp,
        },
        15 * 60 * 60 * 1000 // 15 mins
      );

      this.mailService.sendUserAccountSetupEmail(otp, user);

      return { user, token };
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
  ): Promise<CachedAuthToken> {
    const data = await this.cacheService.get<CachedAuthToken>(token);
    if (!data || data.otp !== otp || data.authType !== AuthTokenTypes.RESET) {
      throw new UnauthorizedException('Invalid token');
    }

    return data;
  }

  public async resetPassword(item: ResetPasswordDto): Promise<any> {
   const authToken = await this.verifyPasswordResetOtp(item);
   const password = await this.hashPassword(item.password);
   await this.userService.changePassword(authToken.userId, password);
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
