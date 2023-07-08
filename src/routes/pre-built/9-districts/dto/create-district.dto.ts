import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateDistrictDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly idProvince: string;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsString()
	readonly type: string;
}
