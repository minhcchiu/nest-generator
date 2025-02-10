import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "resources",
})
export class Resource {
  @Prop({ type: String, unique: true, required: true })
  readonly name: string;

  @Prop({ type: String, unique: true, required: true })
  readonly resourceKey: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  readonly createdBy: ObjectId;

  @Prop({ type: String })
  readonly description?: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Resource.name }])
  readonly relationResourceIds: ObjectId[] = [];
}

type ResourceDocument = HydratedDocument<Resource>;
const ResourceSchema = SchemaFactory.createForClass(Resource);

export { ResourceDocument, ResourceSchema };
