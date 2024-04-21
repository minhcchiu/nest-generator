import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateDistrictDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: string;

	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
