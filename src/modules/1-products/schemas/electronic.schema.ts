import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "electronics",
})
export class Electronic {
  @Prop({ type: String, required: true })
  readonly manufacture: string;

  @Prop({ type: String, required: true })
  readonly model: string;

  @Prop({ type: String, required: true })
  readonly color: string;
}

export type ElectronicDocument = Electronic & HydratedDocument<Electronic>;
export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
