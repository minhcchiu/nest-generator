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
	@ApiProperty({ required: false })
	@ValidateIf((o) => !o.phone && !o.email)
	@IsString()
	username?: string;

	@ApiProperty({ required: false })
	@ValidateIf((o) => !o.username && !o.phone)
	@IsEmail()
	email?: string;

	@ApiProperty({ required: false })
	@ValidateIf((o) => !o.username && !o.email)
	@IsString()
	phone?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	fullName: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	avatar?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	dateOfBirth?: number;

	@ApiProperty({ enum: GenderEnum, required: false })
	@IsOptional()
	@IsEnum(GenderEnum)
	gender?: GenderEnum;

	@ApiProperty({ enum: AccountType })
	@IsNotEmpty()
	@IsEnum(AccountType)
	accountType: AccountType;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	isNotificationActive?: boolean;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	storeId?: NullableType<string>;

	@ApiProperty({ required: false, type: [String] })
	@IsOptional()
	@IsMongoId({ each: true })
	favoriteStores: string[];

	@ApiProperty({ enum: Role, isArray: true, required: false })
	@IsOptional()
	@IsArray()
	@IsEnum(Role, { each: true })
	roles?: Role[];

	@ApiProperty({ enum: AccountStatus, required: false })
	@IsOptional()
	@IsEnum(AccountStatus)
	status?: AccountStatus;
}
