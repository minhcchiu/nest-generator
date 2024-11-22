import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";
import { Tag } from "~modules/questions-modules/3-tags/schemas/tag.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "tag_questions",
})
export class TagQuestion {
  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name, required: true })
  questionId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Tag.name, required: true })
  tagId: ObjectId;
}

export type TagQuestionDocument = TagQuestion & HydratedDocument<TagQuestion>;
export const TagQuestionSchema = SchemaFactory.createForClass(TagQuestion);
