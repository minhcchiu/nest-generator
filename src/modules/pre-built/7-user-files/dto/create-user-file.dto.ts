// file.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ResourceTypeEnum } from "~modules/pre-built/7-uploads/enum/resource-type.enum";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";

export class CreateUserFileDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString({ each: true })
	resourceIds: string;

	@IsNotEmpty()
	@IsString()
	fileName: string;

	@IsNotEmpty()
	@IsString()
	fileType: string;

	@IsNotEmpty()
	@IsEnum(ResourceTypeEnum)
	resourceType: ResourceTypeEnum;

	@IsOptional()
	@IsString()
	urlXSmall?: string;

	@IsOptional()
	@IsString()
	urlSmall?: string;

	@IsOptional()
	@IsString()
	urlMedium?: string;

	@IsOptional()
	@IsString()
	urlLarge?: string;

	@IsOptional()
	@IsString()
	urlXLarge?: string;

	@IsNotEmpty()
	@IsString()
	url: string;

	@IsNotEmpty()
	@IsEnum(StorageLocationEnum)
	storageLocation: StorageLocationEnum;
}
