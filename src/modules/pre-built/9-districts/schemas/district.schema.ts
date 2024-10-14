import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Province } from "~pre-built/8-provinces/schemas/province.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "districts",
})
export class District {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Province.name,
    required: true,
  })
  readonly provinceId: ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, required: true })
  readonly nameEn: string;

  @Prop({ type: String, required: true })
  readonly fullName: string;

  @Prop({ type: String, required: true })
  readonly fullNameEn: string;

  @Prop({ type: String, required: true, unique: true })
  readonly codeName: string;

  @Prop({ type: Number, required: true })
  readonly position: number;

  @Prop({ type: String })
  readonly administrativeUnit?: string;

  @Prop({ type: String })
  readonly administrativeUnitEn?: string;
}

export type DistrictDocument = District & HydratedDocument<District>;
export const DistrictSchema = SchemaFactory.createForClass(District);
