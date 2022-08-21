import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';

export class SignupPhoneDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly password: string;

  @IsNotEmpty()
  @Length(4)
  readonly otpCode: string;
}
