import { IsArray, IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { ResourceTypeEnum } from "../enum/resource-type.enum";

export class SaveFilesDto {
	@ApiProperty({ description: "Array of base64-encoded file contents" })
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	files: string[];

	@ApiProperty({ enum: ResourceTypeEnum, description: "Type of the resource" })
	@IsNotEmpty()
	@IsString()
	resourceType: ResourceTypeEnum;
}
