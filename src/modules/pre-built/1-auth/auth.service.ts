import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { NodeEnv } from "src/configurations/enums/config.enum";
import { EnvStatic } from "src/configurations/static.env";
import { generateRandomKey } from "~helpers/generate-random-key";
import { AccountStatus } from "~pre-built/1-users/enums/account-status.enum";
import { FirebaseService } from "~shared/firebase/firebase.service";
import { MailService } from "~shared/mail/mail.service";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { AccountTypeEnum } from "../1-users/enums/account-type.enum";
import { RoleEnum } from "../1-users/enums/role.enum";
import { HashingService } from "../1-users/hashing/hashing.service";
import { authSelect } from "../1-users/select/auth.select";
import { UserService } from "../1-users/user.service";
import { TokenService } from "../5-tokens/token.service";
import { OtpTypeEnum } from "../6-otp/enums/otp-type.enum";
import { OtpService } from "../6-otp/otp.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendOtpDto } from "./dto/send-otp.dto";
import { SocialLoginDto } from "./dto/social-login.dto";
import { SocialInterface } from "./interfaces/social.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly otpService: OtpService,
    private readonly hashingService: HashingService,
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
      roles: [RoleEnum.User],
      fcmTokens: fcmToken ? [fcmToken] : [],
    });

    return this.tokenService.generateUserAuth(newUser);
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

    if (!user) throw new NotFoundException("Incorrect account!");

    if (user.status === AccountStatus.Deleted)
      throw new BadRequestException("The account has been removed.");

    const isPasswordValid = await this.hashingService.compare(user.password, password);

    if (!isPasswordValid) throw new UnauthorizedException("Incorrect account!");

    if (fcmToken) this.userService.saveFcmToken(user._id, fcmToken);

    delete user.password;
    return this.tokenService.generateUserAuth(user);
  }

  async socialLogin({ fcmToken, idToken, accountType }: SocialLoginDto) {
    const decodedIdToken = await this.firebaseService.verifyIdToken(idToken);

    let foundUser = await this.userService.findOne(
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

    if (!foundUser) {
      const newUser = await this.userService.createUser({
        fullName: decodedIdToken.name,
        socialID: decodedIdToken.sub,
        avatar: decodedIdToken.picture,
        email: decodedIdToken.email,
        accountType,
        password: generateRandomKey(32),
        status: AccountStatus.Verified,
        roles: [RoleEnum.User],
      });

      foundUser = newUser.toObject();
    }

    if (fcmToken) this.userService.saveFcmToken(foundUser._id, fcmToken);

    return this.tokenService.generateUserAuth(foundUser);
  }

  async sendToken(input: RegisterDto) {
    await this.userService.validateCreateUser(input);

    const { token, expiresAt } = await this.tokenService.generateUserToken(input);

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

  async sendOtp(input: SendOtpDto) {
    await this.userService.validateCreateUser(input);

    const otpItem = {
      phone: input.phone,
      email: input.email,
      sendOtpTo: input.sendOtpTo,
      otpType: OtpTypeEnum.Register,
    };

    const { expiresAt, otpCode, ...rest } = await this.otpService.sendOtp(otpItem);

    return {
      ...input,
      ...otpItem,
      ...rest,
      otpCode: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? otpCode : undefined,
      expiresAt,
    };
  }

  async logout(userId: Types.ObjectId, fcmToken?: string) {
    Promise.all([
      this.userService.removeFcmTokens([fcmToken]),
      this.tokenService.deleteOne({ user: userId }),
    ]);

    return { message: "Logout success!" };
  }

  async validateSocialLogin(accountType: AccountTypeEnum, socialData: SocialInterface) {
    return {
      accountType,
      ...socialData,
    };
  }

  async refreshToken(token: string) {
    const [tokenDoc] = await Promise.all([
      this.tokenService.findOne({ token }, { populate: { path: "userId", select: authSelect } }),
      this.tokenService.verifyRefreshToken(token),
    ]);

    if (!tokenDoc?.userId) throw new UnauthorizedException("Invalid refresh token!");

    return this.tokenService.generateUserAuth(<any>tokenDoc.userId);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (user.status === AccountStatus.Deleted) {
      throw new BadRequestException("The account has been removed.");
    }

    const { expiresAt, token } = await this.tokenService.generateForgotPasswordToken(user);

    // send email
    await this.mailService.sendForgotPasswordToken(
      { token, expiresAt, fullName: user.fullName },
      email,
    );

    await this.tokenService.updateOne(
      { userId: user._id },
      { userId: user._id, token, expiresAt },
      { upsert: true },
    );

    return {
      email,
      token: EnvStatic.getAppConfig().nodeEnv === NodeEnv.Development ? token : undefined,
      expiresAt,
    };
  }

  async resetPassword(token: string, password: string) {
    const [decoded, tokenDoc] = await Promise.all([
      this.tokenService.verifyForgotPasswordToken(token),
      this.tokenService.deleteOne({ token }),
    ]);

    if (!tokenDoc) throw new UnauthorizedException("Invalid token!");

    const user = await this.userService.resetPassword(stringIdToObjectId(decoded._id), password, {
      projection: authSelect,
    });

    const { accessToken, refreshToken } = await this.tokenService.generateUserAuth(user);

    return { accessToken, refreshToken, user };
  }
}
