import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/routes/users/dto';
import { AccountTypeEnum } from 'src/routes/users/enums/account-type.enum';

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
