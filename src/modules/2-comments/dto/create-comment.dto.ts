import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly postId: string;

	@IsOptional()
	@IsString()
	readonly text: string;

	@IsNotEmpty()
	@IsOptional()
	readonly image: string;
}
