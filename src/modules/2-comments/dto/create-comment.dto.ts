import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsObjectId()
  readonly postId: ObjectId;

  @IsOptional()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsOptional()
  readonly image: string;
}
