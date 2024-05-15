import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
import { HttpMethod } from "../enum/http-method";

export class CreatePolicyDto {
	@IsNotEmpty()
	@IsString()
	readonly policyKey: string;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsString()
	readonly collectionName: string;

	@IsNotEmpty()
	@IsString()
	readonly endpoint: string;

	@IsEnum(HttpMethod)
	readonly method: HttpMethod;

	@IsOptional()
	@IsString()
	readonly description?: string;

	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	readonly userRoles?: RoleEnum[];

	@IsOptional()
	@IsBoolean()
	readonly isPublic?: boolean;
}
