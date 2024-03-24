// file.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { StorageLocationEnum } from "~pre-built/7-uploads/enum/store-location.enum";

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserFileDto {
	@ApiProperty({ type: String, description: "User ID", required: true })
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty({ type: String, description: "Resource ID", required: true })
	@IsNotEmpty()
	@IsString()
	resourceId: string;

	@ApiProperty({ type: String, description: "File Name", required: true })
	@IsNotEmpty()
	@IsString()
	fileName: string;

	@ApiProperty({ type: String, description: "File Type", required: true })
	@IsNotEmpty()
	@IsString()
	fileType: string;

	@ApiProperty({ type: String, description: "File URL", required: true })
	@IsNotEmpty()
	@IsString()
	url: string;

	@ApiProperty({ type: Number, description: "File Size", required: true })
	@IsNotEmpty()
	@IsNumber()
	fileSize: number;

	@ApiProperty({ type: Number, description: "Uploaded At", required: true })
	@IsNotEmpty()
	@IsNumber()
	uploadedAt: number;

	@ApiProperty({ type: String, description: "File Folder", required: true })
	@IsNotEmpty()
	@IsString()
	fileFolder: string;

	@ApiProperty({
		type: String,
		enum: StorageLocationEnum,
		description: "Storage Location",
		required: true,
	})
	@IsNotEmpty()
	@IsEnum(StorageLocationEnum)
	storageLocation: StorageLocationEnum;
}
