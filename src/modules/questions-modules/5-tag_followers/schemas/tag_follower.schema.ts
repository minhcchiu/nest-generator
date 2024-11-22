import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "tag_followers",
})
export class TagFollower {
  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name, required: true })
  questionId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: ObjectId;
}

export type TagFollowerDocument = TagFollower & HydratedDocument<TagFollower>;
export const TagFollowerSchema = SchemaFactory.createForClass(TagFollower);
