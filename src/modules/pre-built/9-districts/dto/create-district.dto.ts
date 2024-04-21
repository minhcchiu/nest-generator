import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateDistrictDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
