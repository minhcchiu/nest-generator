import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "user_question_activities",
})
export class UserQuestionActivity {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, index: true })
  userId: ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Question.name }])
  votedQuestions: ObjectId[] = [];

  @Prop([{ type: SchemaTypes.ObjectId, ref: Question.name }])
  downVotedQuestions: ObjectId[] = [];

  @Prop([{ type: SchemaTypes.ObjectId, ref: Question.name }])
  savedQuestions: ObjectId[] = [];
}

export type UserQuestionActivityDocument = UserQuestionActivity &
  HydratedDocument<UserQuestionActivity>;
export const UserQuestionActivitySchema = SchemaFactory.createForClass(UserQuestionActivity);
