import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";

import { AccountStatus } from "../enums/account-status.enum";
import { AccountType } from "../enums/account-type.enum";
import { GenderEnum } from "../enums/gender.enum";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
	@ValidateIf((o) => !o.phone && !o.email)
	@IsString()
	username?: string;

	@ValidateIf((o) => !o.username && !o.phone)
	@IsEmail()
	email?: string;

	@ValidateIf((o) => !o.username && !o.email)
	@IsString()
	phone?: string;

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
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsDateString()
	dateOfBirth?: Date;

	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@IsNotEmpty()
	@IsEnum(AccountType)
	accountType: AccountType;

	role?: Role;
	status?: AccountStatus;
}
