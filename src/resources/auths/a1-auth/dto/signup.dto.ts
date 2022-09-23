import { PartialType, OmitType } from '@nestjs/mapped-types';
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
import { OtpType } from '~auths/a2-otp/enum/otp-type.enum';
import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';

export class SignupDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'phone', 'password', 'fullName'] as const),
) {
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
  readonly fullName: string;

  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;

  @IsNotEmpty()
  @Length(4)
  readonly otpCode: string;

  @IsNotEmpty()
  @IsEnum(OtpType)
  readonly otpType: OtpType;
}
