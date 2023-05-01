import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '~lazy-modules/mail/mail.module';
import { UserModule } from '~routes/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ATStrategy } from './strategies/at.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [ConfigModule, UserModule, JwtModule, MailModule],
  providers: [AuthService, TokenService, ATStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
