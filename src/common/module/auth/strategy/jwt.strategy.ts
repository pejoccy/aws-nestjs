import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from '../../../interfaces';
import { User } from '../../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('accessToken'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  async validate(payload: JwtPayload): Promise<User & { authType?: 'reset' }> {
    const { email } = payload;
    const user: User = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return { ...user, authType: payload.authType };
  }
}
