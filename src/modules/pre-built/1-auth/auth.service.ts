import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { NodeEnv } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/env.static";
import { generateRandomKey } from "~helpers/generate-random-key";
import { RoleService } from "~modules/pre-built/2-roles/role.service";
import { DecodedToken } from "~modules/pre-built/5-tokens/interface";
import { AccountStatus } from "~pre-built/1-users/enums/account-status.enum";
import { FirebaseService } from "~shared/firebase/firebase.service";
import { MailService } from "~shared/mail/mail.service";
import { HashingService } from "../1-users/hashing/hashing.service";
import { authSelect, formatTokenPayload } from "../1-users/select/auth.select";
import { UserService } from "../1-users/user.service";
import { TokenService } from "../5-tokens/token.service";
import { VerifyOtpDto } from "../6-otp/dto/verify-otp.dto";
import { OtpTypeEnum } from "../6-otp/enums/otp-type.enum";
import { SendOtpToEnum } from "../6-otp/enums/send-otp-to";
import { OtpService } from "../6-otp/otp.service";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordWithOtpDto } from "./dto/password-with-otp.dto";
import { ResetPasswordWithTokenDto } from "./dto/password-with-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { SocialLoginDto } from "./dto/social-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly otpService: OtpService,
    private readonly hashingService: HashingService,
    private readonly roleService: RoleService,
    private readonly i18n: I18nService,
  ) {}

  async register({ fcmToken, otpCode, sendOtpTo, ...input }: RegisterDto) {
    await this.userService.validateCreateUser(input);

    // Verify otp
    if (otpCode) {
      await this.otpService.verifyOtp({
        otpCode,
        sendOtpTo,
        otpType: OtpTypeEnum.Register,
        phone: input.phone,
        email: input.email,
      });

      input.status = AccountStatus.Verified;
    }

    const newUser = await this.userService.createUser({
      ...input,
      roleIds: [(await this.roleService.getRoleUser())._id],
      fcmTokens: fcmToken ? [fcmToken] : [],
    });

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(newUser));
    return {
      ...tokens,
      user: newUser,
    };
  }

  async login({ fcmToken, authKey, password }: LoginDto) {
    const user = await this.userService.findOne(
      {
        $or: [{ email: authKey }, { phone: authKey }, { username: authKey }],
      },
      {
        projection: { ...authSelect, password: 1 },
      },
    );

    if (!user)
      throw new NotFoundException(
        this.i18n.t("errors.INCORRECT_ACCOUNT", { lang: I18nContext.current().lang }),
      );

    if (user.status === AccountStatus.Deleted)
      throw new BadRequestException(
        this.i18n.t("errors.ACCOUNT_REMOVED", { lang: I18nContext.current().lang }),
      );

    const isPasswordValid = await this.hashingService.compare(user.password, password);

    if (!isPasswordValid)
      throw new UnauthorizedException(
        this.i18n.t("errors.INCORRECT_ACCOUNT", { lang: I18nContext.current().lang }),
      );

    if (fcmToken) this.userService.saveFcmToken(user._id, fcmToken);

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(user));
    return {
      ...tokens,
      user,
    };
  }

  async socialLogin({ fcmToken, idToken, accountType }: SocialLoginDto) {
    const decodedIdToken = await this.firebaseService.verifyIdToken(idToken);

    let userFound = await this.userService.findOne(
      {
        $or: [
          {
            socialID: decodedIdToken.sub,
          },
          {
            email: decodedIdToken.email,
          },
        ],
      },
      { projection: authSelect },
    );

    if (!userFound) {
      const newUser = await this.userService.createUser({
        fullName: decodedIdToken.name,
        socialID: decodedIdToken.sub,
        avatar: decodedIdToken.picture,
        email: decodedIdToken.email,
        accountType,
        password: generateRandomKey(32),
        status: AccountStatus.Verified,
        roleIds: [(await this.roleService.getRoleUser())._id],
      });

      userFound = newUser;
    }

    if (fcmToken) this.userService.saveFcmToken(userFound._id, fcmToken);

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(userFound));
    return {
      ...tokens,
      user: userFound,
    };
  }

  async sendToken(input: RegisterDto) {
    await this.userService.validateCreateUser(input);

    const { token, expiresAt } = await this.tokenService.generateRegisterUserToken(input);

    await this.mailService.sendUserToken(
      {
        token,
        expiresAt,
        fullName: input.fullName,
      },
      input.email,
    );

    return {
      ...input,
      token: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? token : undefined,
      expiresAt,
    };
  }

  async activateToken(token: string) {
    const decoded = await this.tokenService.verifyUserToken(token);

    // delete key of token
    delete decoded.iat;
    delete decoded.exp;

    decoded.status = AccountStatus.Verified;

    return this.register(decoded);
  }

  async logout(decodedToken: DecodedToken, fcmToken?: string) {
    if (fcmToken) this.userService.removeFcmTokens([fcmToken]);

    const tokens = await this.tokenService.findOne({ userId: decodedToken._id });

    if (!tokens) return { message: "Logout success!" };

    const validTokens = tokens.tokens.filter(
      t => new Date(t.expiresAt) > new Date() && t.tokenId !== decodedToken.tokenId,
    );
    const newExpiredAt =
      Math.max(...validTokens.map(t => new Date(t.expiresAt).getTime())) || Date.now();

    this.tokenService.updateOne(
      { userId: decodedToken._id },
      { $set: { tokens: validTokens, expiresAt: new Date(newExpiredAt) } },
    );

    return { message: "Logout success!" };
  }

  async refreshToken(token: string, fcmToken?: string) {
    const [tokenDoc] = await Promise.all([
      this.tokenService.updateOne({ "tokens.token": token }, { $pull: { tokens: { token } } }),
      this.tokenService.verifyRefreshToken(token),
    ]);

    if (!tokenDoc?.userId)
      throw new UnauthorizedException(
        this.i18n.t("errors.INVALID_REFRESH_TOKEN", { lang: I18nContext.current().lang }),
      );

    const userFound = await this.userService.findById(tokenDoc.userId, { projection: authSelect });
    if (fcmToken) this.userService.saveFcmToken(userFound._id, fcmToken);

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(userFound));
    return {
      ...tokens,
      user: userFound,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne({ email });
    if (!user)
      throw new NotFoundException(
        this.i18n.t("errors.USER_NOT_FOUND", { lang: I18nContext.current().lang }),
      );

    if (user.status === AccountStatus.Deleted)
      throw new BadRequestException(
        this.i18n.t("errors.ACCOUNT_REMOVED", { lang: I18nContext.current().lang }),
      );

    const { expiresAt, token } = await this.tokenService.generateForgotPasswordToken(user);

    // send email
    await this.mailService.sendForgotPasswordToken(
      { token, expiresAt, fullName: user.fullName },
      email,
    );

    await this.tokenService.saveToken({
      userId: user._id,
      token,
      tokenId: "FORGOT_PASSWORD",
      expiresAt,
    });

    return {
      email,
      token: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? token : undefined,
      expiresAt,
    };
  }

  async resetPasswordWithToken(input: ResetPasswordWithTokenDto) {
    const decoded = await this.tokenService.verifyForgotPasswordToken(input.token);

    if (!decoded?._id)
      throw new UnauthorizedException(
        this.i18n.t("errors.INVALID_REFRESH_TOKEN", { lang: I18nContext.current().lang }),
      );

    const tokenRemoved = await this.tokenService.updateOne(
      { "tokens.tokenId": "FORGOT_PASSWORD", userId: decoded._id, "tokens.token": input.token },
      { $pullAll: { tokens: { tokenId: "FORGOT_PASSWORD" } } },
    );

    if (!tokenRemoved)
      throw new BadRequestException(
        this.i18n.t("errors.TOKEN_EXPIRED", { lang: I18nContext.current().lang }),
      );

    const user = await this.userService.resetPasswordById(tokenRemoved.userId, input.password, {
      projection: authSelect,
    });
    if (input.fcmToken) this.userService.saveFcmToken(user._id, input.fcmToken);

    // Handle logout others
    if (input.isLogoutOthers) {
      await this.tokenService.deleteMany({ userId: user._id });
    }

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(user));
    return {
      ...tokens,
      user,
    };
  }

  async resetPasswordWithOtp(input: ResetPasswordWithOtpDto) {
    await this.otpService.verifyOtp({
      ...input,
      otpType: OtpTypeEnum.ResetPassword,
      otpCode: input.otpCode,
    });

    let filter: Pick<VerifyOtpDto, "email" | "phone"> = { email: input.email };
    if (input.sendOtpTo === SendOtpToEnum.Phone) filter = { phone: input.phone };

    const user = await this.userService.resetPasswordBy(filter, input.password, {
      projection: authSelect,
    });

    // Handle logout others
    if (input.isLogoutOthers) {
      await this.tokenService.deleteMany({ userId: user._id });
    }

    const tokens = await this.tokenService.generateAuthTokens(formatTokenPayload(user));
    return {
      ...tokens,
      user,
    };
  }

  async getTokens() {
    return this.tokenService.findMany({});
  }
}
