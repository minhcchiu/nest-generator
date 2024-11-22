import { IsEnum, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { VoteTypeEnum } from "~modules/questions-modules/2-votes/enums/vote-type.enum";

export class CreateVoteDto {
  @IsNotEmpty()
  @IsObjectId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  questionId: ObjectId;

  @IsNotEmpty()
  @IsEnum(VoteTypeEnum)
  voteType: VoteTypeEnum;
}
