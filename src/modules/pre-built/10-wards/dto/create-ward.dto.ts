import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
export class CreateWardDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: string;
	@IsNotEmpty()
	@IsMongoId()
	readonly districtId: string;
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
