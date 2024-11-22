import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "tags",
})
export class Tag {
  @Prop({ type: String, required: true, convert: v => v.toLowerCase() })
  name: string;

  @Prop({ type: Number, default: 0 })
  questionCount: number = 0;

  @Prop({ type: Number, default: 0 })
  followerCount: number = 0;
}

export type TagDocument = Tag & HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);
