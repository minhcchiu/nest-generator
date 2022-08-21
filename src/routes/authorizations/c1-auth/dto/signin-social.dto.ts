import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from '~common/c1-user/dto/create-user.dto';
import { AccountTypeEnum } from '~common/c1-user/enums/account-type.enum';

export class SigninSocialDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  authKey: string;

  @IsNotEmpty()
  @IsEnum(AccountTypeEnum)
  accountType: AccountTypeEnum;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
