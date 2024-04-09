// file.dto.ts

import {
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";
import { UploadType } from "~types/upload-type";

export class CreateUserFileDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	resourceId: string;

	@IsNotEmpty()
	@IsString()
	fileName: string;

	@IsNotEmpty()
	@IsString()
	fileType: string;

	@IsNotEmpty()
	@IsString()
	uploadType: UploadType;

	@IsOptional()
	@IsString()
	fileOriginal: string;

	@IsOptional()
	@IsString()
	fileXs?: string;

	@IsOptional()
	@IsString()
	fileSm?: string;

	@IsOptional()
	@IsString()
	fileMd?: string;

	@IsOptional()
	@IsString()
	fileLg?: string;

	@IsNumber()
	fileSize: number;

	@IsISO8601()
	uploadedAt: Date;

	@IsNotEmpty()
	@IsString()
	fileFolder: string;

	@IsEnum(StorageLocationEnum)
	storageLocation: StorageLocationEnum;

	@IsNotEmpty()
	@IsString()
	isUploadedSuccess: string;
}
