import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly postId: ObjectId;

  @IsOptional()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsOptional()
  readonly image: string;
}
