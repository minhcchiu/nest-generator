import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Role } from "~pre-built/1-users/enums/role.enum";

import { ApiProperty } from "@nestjs/swagger";

import { MenuLevel } from "../enum/menu-level";

export class CreateMenuDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsMongoId()
	readonly parentId?: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly prefix: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly icon?: string;

	@ApiProperty({ enum: MenuLevel, required: false })
	@IsOptional()
	@IsEnum(MenuLevel)
	readonly level: MenuLevel;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly url?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	readonly position?: number;

	@ApiProperty({ default: true })
	@IsOptional()
	@IsBoolean()
	readonly isHorizontal: boolean = true;

	@ApiProperty({ default: true })
	@IsOptional()
	@IsBoolean()
	readonly isActive: boolean = true;

	@ApiProperty({ enum: Role, isArray: true, required: false })
	@IsOptional()
	@IsArray()
	@IsEnum(Role, { each: true })
	readonly role: Role[];
}
