import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { AccountStatus } from "../enums/account-status.enum";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";

export class CreateUserDto {
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  socialID?: string;

  @IsNotEmpty()
  @IsString()
  accountType: AccountTypeEnum;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateBirth?: Date;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  portfolioWebsite?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  fmcEnabled?: boolean;

  status?: AccountStatus;
  fcmTokens?: string[];

  // Features
  @IsOptional()
  @IsNumber()
  reputation?: number;

  @IsOptional()
  @IsNumber()
  questionsCount?: number;

  @IsOptional()
  @IsNumber()
  answersCount?: number;
}
