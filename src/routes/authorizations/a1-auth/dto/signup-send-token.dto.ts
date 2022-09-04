import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';

export class SignupSendTokenDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'fullName'] as const),
) {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

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
}
