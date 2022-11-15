import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';
import { AccountTypeEnum } from '~common/c1-users/enums/account-type.enum';

export class SignInSocialDto extends PartialType(
  OmitType(CreateUserDto, ['accountType', 'role']),
) {
  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  readonly authKey: string;

  @IsNotEmpty()
  @IsEnum(AccountTypeEnum)
  readonly accountType: AccountTypeEnum;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
