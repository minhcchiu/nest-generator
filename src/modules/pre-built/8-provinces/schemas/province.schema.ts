import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "provinces",
})
export class Province {
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
  readonly sortOrder: number;

  @Prop({ type: String })
  readonly administrativeUnit?: string;

  @Prop({ type: String })
  readonly administrativeUnitEn?: string;

  @Prop({ type: String })
  readonly administrativeRegion?: string;

  @Prop({ type: String })
  readonly administrativeRegionEn?: string;
}

export type ProvinceDocument = Province & HydratedDocument<Province>;
export const ProvinceSchema = SchemaFactory.createForClass(Province);
