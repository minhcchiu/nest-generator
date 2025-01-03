import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateGeneralDto {
  @IsOptional()
  @IsObjectId()
  authorId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  questionId: ObjectId;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsObjectId({ each: true })
  upvotes: ObjectId[];

  @IsOptional()
  @IsObjectId({ each: true })
  downvotes: ObjectId[];

  @IsOptional()
  @IsNumber()
  repliesCount: number = 0;

  @IsOptional()
  @IsObjectId()
  parentId?: string;
}
