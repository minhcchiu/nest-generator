import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateWardDto {
	@ApiProperty({ description: "ID of the associated province" })
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: string;

	@ApiProperty({ description: "ID of the associated district" })
	@IsNotEmpty()
	@IsMongoId()
	readonly districtId: string;

	@ApiProperty({ description: "Name of the ward" })
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
