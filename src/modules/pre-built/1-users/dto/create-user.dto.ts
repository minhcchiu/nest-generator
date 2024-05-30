import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";
import { AccountStatus } from "../enums/account-status.enum";
import { AccountTypeEnum } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";

export class CreateUserDto {
	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
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
	@MinLength(6)
	@MaxLength(50)
	password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	fullName: string;

	@IsOptional()
	@IsEnum(RoleEnum)
	roles?: RoleEnum[];

	@IsNotEmpty()
	@IsEnum(AccountTypeEnum)
	accountType: AccountTypeEnum;

	@IsOptional()
	@IsISO8601()
	dateBirth?: Date;

	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@IsOptional()
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsBoolean()
	fmcEnabled?: boolean;

	status?: AccountStatus;
}
