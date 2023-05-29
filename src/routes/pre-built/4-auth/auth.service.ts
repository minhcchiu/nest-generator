import { ObjectId } from 'mongodb';
import { AccountStatus } from '~pre-built/1-users/enums/account-status.enum';
import { authSelect } from '~pre-built/1-users/select/auth.select';
import { TokenService } from '~pre-built/5-tokens/token.service';
import { MailService } from '~shared/mail/mail.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../1-users/user.service';
import { LoginSocialDto } from './dto/login-social.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async login({ password, ...credentials }: LoginDto) {
    const user = await this.userService.findOne(credentials, { projection: authSelect });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.deleted) {
      throw new BadRequestException('The account has been removed.');
    }

    const isPasswordValid = await this.userService.comparePassword(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect account!');
    }

    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    await this.tokenService.updateOne(
      { user: user._id },
      { user: user._id, ...refreshToken },
      { upsert: true },
    );

    delete user.password;
    return { accessToken, refreshToken, user };
  }

  async loginBySocial(data: LoginSocialDto) {
    let user = await this.userService.findOne({ socialToken: data.socialToken });

    if (!user) user = await this.userService.create({ ...data, status: AccountStatus.ACTIVE });

    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    await this.tokenService.updateOne(
      { user: user._id },
      { user: user._id, ...refreshToken },
      { upsert: true },
    );

    delete user.password;
    return { accessToken, refreshToken, user };
  }

  async register(data: RegisterDto) {
    const { _id, role } = await this.userService.create(data);

    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
      _id: _id,
      role: role,
    });

    await this.tokenService.updateOne(
      { user: _id },
      { user: _id, ...refreshToken },
      { upsert: true },
    );

    const user = { ...data, _id, role };

    delete user.password;
    return { accessToken, refreshToken, user };
  }

  async sendRegisterToken(data: RegisterDto) {
    await this.userService.validateCreateUser({ email: data.email, phone: data.phone });

    const token = await this.tokenService.generateUserToken(data);
    await this.mailService.sendRegisterToken(token, data.email, 'Register account.');

    return { message: 'Send register account success!' };
  }

  async activateRegisterToken(token: string) {
    const decoded = await this.tokenService.verifySignupToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    decoded.status = AccountStatus.INACTIVE;
    return this.register(decoded);
  }

  async logout(userId: ObjectId) {
    return this.tokenService.deleteOne({ user: userId });
  }

  async refreshToken(token: string) {
    const [decoded, tokenDoc] = await Promise.all([
      this.tokenService.verifyRefreshToken(token),
      this.tokenService.findOne({ token }),
    ]);

    if (!tokenDoc) throw new UnauthorizedException('Invalid token!');

    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
      _id: decoded._id,
      role: decoded.role,
    });

    await this.tokenService.updateById(tokenDoc._id, refreshToken);

    return { accessToken, refreshToken };
  }

  async sendResetPasswordToken(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.deleted) {
      throw new BadRequestException('The account has been removed.');
    }

    const token = await this.tokenService.generateResetPasswordToken({
      _id: user._id,
      role: user.role,
    });

    await this.tokenService.updateOne(
      { user: user._id },
      { user: user._id, ...token },
      { upsert: true },
    );

    await this.mailService.sendResetPasswordToken(token, email, 'Reset password.');

    return { email };
  }

  async resetPassword(token: string, password: string) {
    const [decoded, tokenDoc] = await Promise.all([
      this.tokenService.verifyResetPasswordToken(token),
      this.tokenService.deleteOne({ token }),
    ]);

    if (!tokenDoc) throw new UnauthorizedException('Invalid token!');

    const user = await this.userService.resetPassword(decoded._id, password, {
      projection: authSelect,
    });

    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    await this.tokenService.updateOne(
      { user: user._id },
      { user: user._id, ...refreshToken },
      { upsert: true },
    );

    return { accessToken, refreshToken, user };
  }
}
