import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateWardDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly provinceId: Types.ObjectId;

	@IsNotEmpty()
	@IsMongoId()
	readonly districtId: Types.ObjectId;

	@IsNotEmpty()
	@IsString()
	readonly name: string;
}
