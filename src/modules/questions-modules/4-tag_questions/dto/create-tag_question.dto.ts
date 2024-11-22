import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTagQuestionDto {
  @IsNotEmpty()
  @IsObjectId()
  questionId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  tagId: ObjectId;
}
