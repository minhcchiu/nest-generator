import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "questions",
})
export class Question {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  authorId: ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: "" })
  content: string;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  upvoteCount: number;

  @Prop({ type: Number, default: 0 })
  downvoteCount: number;
}

export type QuestionDocument = Question & HydratedDocument<Question>;
export const QuestionSchema = SchemaFactory.createForClass(Question);
