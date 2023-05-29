import { UserModule } from '~pre-built/1-users/user.module';
import { EndpointModule } from '~pre-built/2-endpoints/endpoint.module';
import { TokenModule } from '~pre-built/5-tokens/token.module';
import { MailModule } from '~shared/mail/mail.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TokenModule, ConfigModule, UserModule, JwtModule, MailModule, EndpointModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
