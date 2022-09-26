import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';

import { GenderEnum } from '~common/c1-users/enums/gender.enum';
import { RoleEnum } from '~common/c1-users/enums/role.enum';
import { AccountTypeEnum } from '../enums/account-type.enum';

export class CreateUserDto {
  @IsOptional()
  @IsMongoId()
  readonly idAddress?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsOptional()
  @IsEnum(AccountTypeEnum)
  readonly accountType?: AccountTypeEnum;

  @ValidateIf((object) => !object.phone)
  @IsEmail()
  readonly email?: string;

  @ValidateIf((object) => !object.email)
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @Length(6, 50)
  readonly password?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  readonly gender?: GenderEnum;

  @IsOptional()
  @IsNumber()
  readonly dateOfBirth?: number;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;

  @IsOptional()
  @MinLength(12)
  readonly deviceID?: string;
}
