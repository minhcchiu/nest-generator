import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWTConfig } from '~config/environment';

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'ac_token') {
  constructor(private readonly configService: ConfigService) {
    const jwtConfig = configService.get<JWTConfig>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secrets.access,
    });
  }

  /**
   * Validate access token
   *
   * @param payload
   * @returns
   */

  validate(payload: any) {
    return payload;
  }
}
