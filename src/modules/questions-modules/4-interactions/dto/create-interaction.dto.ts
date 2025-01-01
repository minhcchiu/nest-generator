import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateInteractionDto {
  @IsNotEmpty()
  @IsObject({ each: true })
  userId: ObjectId[];

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsObjectId()
  questionId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  answerId?: ObjectId;

  @IsOptional()
  @IsObjectId({ each: true })
  tagIds?: ObjectId[];
}
