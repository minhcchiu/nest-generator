import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
} from "class-validator";
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
import { HttpMethod } from "../enum/http-method";

export class CreateEndpointDto {
	@IsOptional()
	@IsString()
	readonly collectionName: string;

	@IsOptional()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly path: string;

	@IsEnum(HttpMethod)
	readonly method: HttpMethod;

	@IsOptional()
	@IsString()
	readonly description?: string;

	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	readonly userRoles: RoleEnum[];

	@IsOptional()
	@IsBoolean()
	readonly isPublic: boolean;
}
