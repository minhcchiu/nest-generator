import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "categories",
})
export class Order {
  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, unique: true })
  position: number;

  @Prop({ type: String, required: true })
  countStores: string;

  @Prop({ type: Boolean, default: false })
  isOther: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export type OrderDocument = Order & HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
