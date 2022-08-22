import { PartialType } from '@nestjs/mapped-types';
import {
  MinLength,
  MaxLength,
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
} from 'class-validator';

import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';

export class SignupEmailDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(128)
  readonly email: string;

  @IsString()
  @Length(6, 50)
  readonly password: string;

  @IsNotEmpty()
  @Length(4)
  readonly otpCode: string;
}
