import { AuthKeyEnum } from '../enums/auth-key.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/routes/users/dto';

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
