import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "answers",
})
export class Answer {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  authorId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name, required: true })
  questionId: ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: User.name }])
  upvotes: ObjectId[];

  @Prop([{ type: SchemaTypes.ObjectId, ref: User.name }])
  downvotes: ObjectId[];

  @Prop({ type: Number, default: 0 })
  repliesCount: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Answer.name })
  parentId?: string;
}

export type AnswerDocument = Answer & HydratedDocument<Answer>;
export const AnswerSchema = SchemaFactory.createForClass(Answer);
