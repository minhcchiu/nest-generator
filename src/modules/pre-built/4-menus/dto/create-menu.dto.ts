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
import { RoleEnum } from "~pre-built/1-users/enums/role.enum";
import { MenuLevel } from "../enum/menu-level";
export class CreateMenuDto {
	@IsOptional()
	@IsMongoId()
	readonly parentId?: string;
	@IsNotEmpty()
	@IsString()
	readonly name: string;
	@IsOptional()
	@IsString()
	readonly collectionName: string;
	@IsOptional()
	@IsString()
	readonly icon?: string;
	@IsOptional()
	@IsEnum(MenuLevel)
	readonly level: MenuLevel;
	@IsOptional()
	@IsString()
	readonly url?: string;
	@IsOptional()
	@IsNumber()
	readonly position?: number;
	@IsOptional()
	@IsBoolean()
	readonly isHorizontal: boolean = true;
	@IsOptional()
	@IsBoolean()
	readonly isActive: boolean = true;
	@IsOptional()
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	readonly role: RoleEnum[];
}
