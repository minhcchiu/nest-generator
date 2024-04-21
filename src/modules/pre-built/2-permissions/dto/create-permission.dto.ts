import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
export class CreatePermissionDto {
	@IsNotEmpty()
	@IsString()
	readonly collectionName: string;
	@IsOptional()
	@IsString()
	readonly name: string;
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	readonly endpoints: string[];
	@IsOptional()
	@IsString()
	readonly description?: string;
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	readonly roles: RoleEnum[];
	@IsOptional()
	@IsNumber()
	readonly position: number;
}
