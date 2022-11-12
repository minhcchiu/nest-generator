import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpType } from '../enum/otp-type.enum';
import { AuthKeyEnum } from '~auths/a1-auth/enums/auth-key.enum';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyEnum)
  @IsString({ each: true })
  readonly authKey: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  otpType: OtpType;

  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
