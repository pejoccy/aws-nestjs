import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { SetupBusinessDto } from '../account/business/dto/setup-business.dto';
import { SetupPatientDto } from '../account/dto/setup-patient.dto';
import {
  SetupSpecialistDto,
} from '../account/specialist/dto/setup-specialist.dto';
import { PublicRoute } from '../common/decorators/public-route-decorator';
import { ApiResponseMeta } from '../common/decorators/response.decorator';
import { UserRoles } from '../common/interfaces';
import { AuthService } from './auth.service';
import { AuthOtpDto } from './dto/auth-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InitAccountDto } from './dto/init-account.dto';
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
  async signUp(@Body() item: InitAccountDto) {
    return this.authService.initiateAccount(item);
  }

  @ApiResponseMeta({ message: 'Patient account created successfully!' })
  @Post('/setup-patient')
  @PublicRoute()
  async completePatientAccountSetup(@Body() item: SetupPatientDto) {
    return this.authService.signUp({ ...item, userType: UserRoles.PATIENT });
  }

  @ApiResponseMeta({ message: 'Specialist account created successfully!' })
  @Post('/setup-specialist')
  @PublicRoute()
  async completeSpecialistAccountSetup(
    @Body() {
      category,
      specializationId,
      otherSpecialization,
      ...item
    }: SetupSpecialistDto
  ) {
    return this.authService.signUp({
      ...item,
      specialist: { category, specializationId, otherSpecialization },
      userType: UserRoles.SPECIALIST,
    });
  }

  @ApiResponseMeta({ message: 'Business account created successfully!' })
  @Post('/setup-business')
  @PublicRoute()
  async completeBusinessSetup(
    @Body() { otp, token, ...business }: SetupBusinessDto
  ) {
    return this.authService.signUp({
      otp,
      token,
      business,
      userType: UserRoles.BUSINESS
    });
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
    await this.authService.verifyTokenizedOtp(item);
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
