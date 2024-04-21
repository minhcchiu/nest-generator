import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCommentDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly postId: Types.ObjectId;

	@IsOptional()
	@IsString()
	readonly text: string;

	@IsNotEmpty()
	@IsOptional()
	readonly image: string;
}
