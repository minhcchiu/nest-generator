import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigName, JWTConfig } from '~config/environment';

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(readonly configService: ConfigService) {
    const jwtConfig = configService.get<JWTConfig>(ConfigName.jwt);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.accessToken.secret,
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
