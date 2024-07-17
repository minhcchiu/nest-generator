import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId, ToObjectId } from "~common/validators/objectId";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsObjectId()
  @ToObjectId()
  readonly postId: Types.ObjectId;

  @IsOptional()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsOptional()
  readonly image: string;
}
