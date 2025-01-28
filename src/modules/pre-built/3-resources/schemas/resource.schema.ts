import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "resources",
})
export class Resource {
  @Prop({ type: String, unique: true, required: true })
  readonly name: string;

  @Prop({ type: String, unique: true, required: true })
  readonly key: string;

  @Prop({ type: String })
  readonly description?: string;
}

type ResourceDocument = HydratedDocument<Resource>;
const ResourceSchema = SchemaFactory.createForClass(Resource);

export { ResourceDocument, ResourceSchema };
