import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsOptional,
	IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";
import { HttpMethod } from "../enum/http-method";

export class CreateEndpointDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly collectionName: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly name: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly path: string;

	@ApiProperty({ required: false })
	@IsEnum(HttpMethod)
	readonly method: HttpMethod;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly description?: string;

	@ApiProperty({
		enum: RoleEnum,
		isArray: true,
		required: false,
	})
	@IsArray()
	@IsEnum(RoleEnum, { each: true })
	readonly userRoles: RoleEnum[];

	@IsOptional()
	@IsBoolean()
	readonly isPublic: boolean;
}
