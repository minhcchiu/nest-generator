import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { AuthKeyEnum } from '../enums/auth-key.enum';

export class SignupDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'phone', 'password', 'fullName'] as const),
) {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyEnum)
  @IsString({ each: true })
  readonly authKey: string;

  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;

  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @Length(4)
  readonly otpCode: string;
}
