import { IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { ResourceTypeEnum } from "../enum/resource-type.enum";

export class SaveFileDto {
	@ApiProperty({ description: "Base64-encoded file content" })
	@IsNotEmpty()
	@IsString()
	file: string;

	@ApiProperty({ enum: ResourceTypeEnum, description: "Type of the resource" })
	@IsNotEmpty()
	@IsString()
	resourceType: ResourceTypeEnum;
}
