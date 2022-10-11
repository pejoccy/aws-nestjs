import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CacheService } from '../../common/cache/cache.service';
import {
  AuthTokenTypes,
  CachedAuthData,
  JwtPayload,
} from '../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  async validate(
    request: Request,
    jwtPayload: JwtPayload,
  ): Promise<CachedAuthData> {
    const data = await this.refreshAuthToken(request, jwtPayload);
    if (!data) {
      throw new UnauthorizedException();
    }

    return data;
  }

  private async refreshAuthToken(request: Request, jwtPayload: JwtPayload) {
    let [, token] = String(request.headers['authorization']).split(/\s+/);
    if (!token) {
      token = request['query']?.token;
    }
    const [, , cacheKey] = String(token).split('.');
    if (!cacheKey) {
      return undefined;
    }

    if (jwtPayload.authType !== AuthTokenTypes.AUTH) {
      return this.cacheService.get(cacheKey);
    }

    const cacheData = await this.cacheService.wrap(
      cacheKey,
      (cachedData, error) => {
        if (error) console.error(error);

        return cachedData;
      },
      { ttl: this.configService.get<number>('jwt.signOptions.expiresIn') },
    );

    return cacheData;
  }
}
