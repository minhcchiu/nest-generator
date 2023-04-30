import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

import { AuthKeyType } from '../enums/auth-key.enum';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyType)
  @IsString({ each: true })
  readonly authKey: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  readonly otpCode: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
