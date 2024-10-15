import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "categories",
})
export class Category {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  plainId?: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: ObjectId;
}

export type CategoryDocument = Category & HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
