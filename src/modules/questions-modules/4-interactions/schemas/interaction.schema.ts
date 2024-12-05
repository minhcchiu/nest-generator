import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Answer } from "~modules/questions-modules/1-answers/schemas/answer.schema";
import { Question } from "~modules/questions-modules/1-questions/schemas/question.schema";
import { Tag } from "~modules/questions-modules/3-tags/schemas/tag.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "interactions",
})
export class Interaction {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: ObjectId[];

  @Prop({ type: String, required: true })
  action: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Question.name })
  questionId?: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Answer.name })
  answerId?: ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Tag.name }])
  tagIds?: ObjectId[];
}

export type InteractionDocument = Interaction & HydratedDocument<Interaction>;
export const InteractionSchema = SchemaFactory.createForClass(Interaction);
