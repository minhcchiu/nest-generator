import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class AuthorDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: Types.ObjectId;

	@IsOptional()
	@IsString()
	readonly avatar: string;

	@IsNotEmpty()
	@IsString()
	readonly fullName: string;
}
