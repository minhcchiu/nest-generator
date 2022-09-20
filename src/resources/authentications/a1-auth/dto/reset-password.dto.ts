import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { OtpType } from '~authentications/a2-otp/enum/otp-type.enum';

export class ResetPasswordDto {
  @ValidateIf((object) => !object.phone)
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ValidateIf((object) => !object.email)
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  readonly otpType: OtpType;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  readonly otpCode: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
