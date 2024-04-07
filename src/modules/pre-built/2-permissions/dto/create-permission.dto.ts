import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "~modules/pre-built/1-users/enums/role.enum";

export class CreatePermissionDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	readonly collectionName: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	readonly name: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	readonly endpoints: string[];

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
	readonly roles: RoleEnum[];

	@ApiProperty({ required: false })
	@IsOptional()
	@IsNumber()
	readonly position: number;
}
