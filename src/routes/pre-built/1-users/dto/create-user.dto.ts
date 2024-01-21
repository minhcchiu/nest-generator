import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf,
} from "class-validator";
import { NullableType } from "~utils/types/nullable.type";

import { ApiProperty } from "@nestjs/swagger";

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
	@IsNumber()
	dateOfBirth?: number;

	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@ApiProperty({ example: AccountType.Local })
	@IsNotEmpty()
	@IsEnum(AccountType)
	accountType: AccountType;

	@IsOptional()
	@IsBoolean()
	isNotificationActive?: boolean;

	@IsOptional()
	@IsMongoId()
	storeId?: NullableType<string>;

	@IsOptional()
	@IsMongoId({ each: true })
	favoriteStores: string[];

	@IsOptional()
	@IsArray()
	@IsEnum(Role, { each: true })
	roles?: Role[];

	@IsOptional()
	@IsEnum(AccountStatus)
	status?: AccountStatus;
}
