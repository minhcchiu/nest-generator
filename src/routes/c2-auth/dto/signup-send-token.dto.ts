import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/routes/users/dto';

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
}
