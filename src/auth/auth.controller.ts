import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { PublicRoute } from '../common/decorators/public-route-decorator';
import { ApiResponseMeta } from '../common/decorators/response.decorator';
import { CreateUserDto } from '../account/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}
  
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('/login')
  @PublicRoute()
  async signIn(
    @Body() item: SignInDto,
    @RealIP() ip: string,
  ): Promise<any> {
    return this.authService.signIn({ ...item, ipAddress: ip });
  }

  @ApiResponseMeta({ message: 'Check email to complete registration' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('/register')
  @PublicRoute()
  async signUp(@Body() item: CreateUserDto) {
    return this.authService.signUp(item);
  }

  @ApiResponseMeta({
    message: 'A password reset token has been sent to your email'
  })
  @Post('/forgotPassword')
  @PublicRoute()
  async forgotPassword(
    @Body() item: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(item);
  }

  @ApiResponseMeta({ message: 'Token verified successfully!' })
  @Post('/verifyToken')
  @PublicRoute()
  async verifyToken(@Body() item: AuthOtpDto) {
    await this.authService.verifyPasswordResetOtp(item);
  }

  @ApiResponseMeta({ message: 'Password successfully reset'})
  @Post('/resetPassword')
  @PublicRoute()
  async resetPassword(
    @Body() item: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(item);
  }
}
