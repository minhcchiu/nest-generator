import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

import { AuthKeyType } from '../enums/auth-key.enum';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  readonly authValue: string;

  @IsNotEmpty()
  @IsEnum(AuthKeyType)
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
}
