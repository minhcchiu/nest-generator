import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "generators",
})
export class Generator {
  @Prop({ type: String })
  collectionName: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: any;
}

export type GeneratorDocument = Generator & HydratedDocument<Generator>;
export const GeneratorSchema = SchemaFactory.createForClass(Generator);
