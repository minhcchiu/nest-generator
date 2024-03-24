import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateDistrictDto {
	@ApiProperty({ description: "ID of the associated province" })
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: string;

	@ApiProperty({ description: "Name of the district" })
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
