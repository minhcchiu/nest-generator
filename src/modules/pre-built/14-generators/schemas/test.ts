import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Document, SchemaTypes } from "mongoose";

@Schema({ timestamps: true, versionKey: false, collection: "coupon" })
export class Coupon {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
  userId: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  discountValue: number;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop([
    {
      type: {
        userId: { type: SchemaTypes.ObjectId, ref: "User" },
        usedAt: { type: Date },
      },
    },
  ])
  usedBy?: Array<any>;
}

export type CouponDocument = Coupon & Document;
export const CouponSchema = SchemaFactory.createForClass(Coupon);
