import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateUserQuestionActivityDto {
  @IsNotEmpty()
  @IsObjectId()
  questionId: ObjectId;

  @IsOptional()
  @IsObjectId()
  userId?: ObjectId;
}
