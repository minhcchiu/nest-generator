import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';

import { GenderEnum } from '~common/c1-user/enums/gender.enum';
import { RoleEnum } from '~common/c1-user/enums/role.enum';

export class CreateUserDto {
  @IsOptional()
  @IsMongoId()
  readonly idAddress?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @Length(12, 50)
  readonly authKey?: string;

  @ValidateIf((o) => Boolean(o.phone) || Boolean(o.email))
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
