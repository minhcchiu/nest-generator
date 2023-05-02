import { ObjectId } from 'mongodb';
import { MailService } from '~lazy-modules/mail/mail.service';
import { authSelect } from '~routes/users/select/auth.select';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { LoginSocialDto } from './dto/login-social.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from '~routes/tokens/token.service';

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

    const tokens = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    delete user.password;
    return { ...tokens, user };
  }

  async loginBySocial(data: LoginSocialDto) {
    let user = await this.userService.findOne({ socialToken: data.socialToken });

    if (!user) user = await this.userService.create(data);

    const tokens = await this.tokenService.generateAuthTokens({
      _id: user._id,
      role: user.role,
    });

    delete user.password;
    return { ...tokens, user };
  }

  async register(data: RegisterDto) {
    const { _id, role } = await this.userService.create(data);

    const tokens = await this.tokenService.generateAuthTokens({
      _id: _id,
      role: role,
    });

    const user = { ...data, _id, role };

    delete user.password;
    return { ...tokens, user };
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

    return this.register(decoded);
  }

  async logout(userId: ObjectId) {
    return this.userService.updateById(userId, { refreshToken: '' });
  }

  async refreshToken(token: string) {
    const decoded = await this.tokenService.verifyRefreshToken(token);

    const user = await this.userService.findById(decoded._id, { projection: authSelect });

    if (!user) throw new NotFoundException('Invalid refresh');

    const tokens = await this.tokenService.generateAuthTokens({ _id: user._id, role: user.role });

    delete user.password;
    return { ...tokens, user };
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

    await this.mailService.sendResetPasswordToken(token, email, 'Reset password.');

    return { email };
  }

  async resetPassword(token: string, password: string) {
    const { _id } = await this.tokenService.verifyResetPasswordToken(token);

    const user = await this.userService.resetPassword(_id, password, {
      projection: authSelect,
    });

    const tokens = await this.tokenService.generateAuthTokens({ _id: user._id, role: user.role });

    return { ...tokens, user };
  }
}
