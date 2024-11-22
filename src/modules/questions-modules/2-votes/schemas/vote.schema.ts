import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";
import { VoteTypeEnum } from "~modules/questions-modules/2-votes/enums/vote-type.enum";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "votes",
})
export class Vote {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name, required: true })
  questionId: ObjectId;

  @Prop({ type: String, enum: VoteTypeEnum, required: true })
  voteType: VoteTypeEnum;
}

export type VoteDocument = Vote & HydratedDocument<Vote>;
export const VoteSchema = SchemaFactory.createForClass(Vote);
