import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { AccountType } from '~routes/users/enums/account-type.enum';
import { CreateUserDto } from '~routes/users/dto/create-user.dto';

export class SignInSocialDto extends PartialType(
  OmitType(CreateUserDto, ['accountType', 'role']),
) {
  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  readonly authKey: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  readonly accountType: AccountType;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
