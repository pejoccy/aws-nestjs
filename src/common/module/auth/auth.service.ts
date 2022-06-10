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
import { AppUtilities } from '../../../app.utilities';
import { BaseService } from '../../../common/base/service';
import {
  AuthTokenTypes,
  CachedAuthToken,
  JwtPayload,
  UserRole,
} from '../../interfaces';
import { Business } from '../business/business.entity';
import { CacheService } from '../cache/cache.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
    private appUtilities: AppUtilities,
    private mailService: MailerService,
    private userService: UserService
  ) {
    super();
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const { raw, affected } = await this.userRepository
      .createQueryBuilder()
      .update({ passwordReset: true })
      .where({ email })
      .returning('*')
      .execute();

    if (affected) {
      const accessToken = this.generateJwtToken({
        id: raw[0].id,
        username: raw[0].username,
        authType: 'reset',
      });

      // emit forgotPassword event
      this.mailService.sendForgotPasswordEmail(raw[0], accessToken);
    }
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({ where: { email } });
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
      expiryTime: this.configService.get('jwt.expiresIn'),
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      profile,
    };
  }

  async signUp({
    email,
    userType,
    business,
    ...userDto
  }: CreateUserDto): Promise<any> {
    const queryRunner = await this.startTransaction();
    try {
      const user = await this.userRepository.save({
        ...userDto,
        email,
        role: userType,
      });
      if (userType === UserRole.BUSINESS) {
        await this.businessRepository.save(business);
      }
      
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

  async verifyPasswordResetOtp(
    { token, otp }: AuthOtpDto
  ): Promise<CachedAuthToken> {
    const data = await this.cacheService.get<CachedAuthToken>(token);
    if (!data || data.otp !== otp || data.authType !== AuthTokenTypes.RESET) {
      throw new UnauthorizedException('Invalid token');
    }

    return data;
  }

  async resetPassword(item: ResetPasswordDto): Promise<any> {
   const authToken = await this.verifyPasswordResetOtp(item);
   const password = await this.hashPassword(item.password);
   await this.userService.changePassword(authToken.userId, password);
  }

  private async hashPassword(password: string, rounds = 10): Promise<string> {
    return bcrypt.hash(password, rounds);
  }

  private async validatePassword(
    password: string,
    user: User
  ): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  private generateJwtToken(payload: any, options?: JwtSignOptions): string {
    options = { expiresIn: '15m', ...options };

    return this.jwtService.sign(payload, options);
  }

  public async setAuthTokenCache(
    jwtPayload: JwtPayload,
    ttl?: number,
    cacheData?: any
  ) {
    ttl = ttl ?? this.configService.get<number>('jwt.signOptions.expiresIn');
    const token = this.generateJwtToken(jwtPayload, { expiresIn: ttl });
    const [, , cacheKey] = token.split('.');
    await this.cacheService.set(cacheKey, cacheData || jwtPayload, ttl);

    return token;
  }
}
