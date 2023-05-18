import { MailModule } from '~lazy-modules/mail/mail.module';
import { EndpointModule } from '~routes/endpoints/endpoint.module';
import { UserModule } from '~routes/users/user.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthGuard } from '../../middleware/auth.guard';
import { AuthService } from './auth.service';
import { TokenModule } from '~routes/tokens/token.module';
import { CacheService } from '~lazy-modules/cache/cache.service.';

@Module({
  imports: [TokenModule, ConfigModule, UserModule, JwtModule, MailModule, EndpointModule],
  providers: [
    AuthService,
    CacheService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
