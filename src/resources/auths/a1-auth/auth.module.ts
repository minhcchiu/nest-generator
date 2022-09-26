import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { OtpModule } from '~auths/a2-otp/otp.module';
import { UserModule } from '~common/c1-users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ATStrategy } from './strategies/at.strategy';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [UserModule, OtpModule, JwtModule],
  providers: [AuthService, TokenService, ATStrategy],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
