import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from '~common/c1-users/dto/create-user.dto';
import { AccountTypeEnum } from '~common/c1-users/enums/account-type.enum';

export class SigninSocialDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  readonly authKey: string;

  @IsNotEmpty()
  @IsEnum(AccountTypeEnum)
  readonly accountType: AccountTypeEnum;

  @IsOptional()
  @IsString()
  @MinLength(12)
  readonly deviceID?: string;
}
