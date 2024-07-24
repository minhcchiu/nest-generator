import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Shop } from "~modules/1-shops/schemas/shop.schema";
import { ProductType } from "../enums/product-type.enum";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "products",
})
export class Product {
  @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name })
  readonly shopId: Types.ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, required: true })
  readonly thumbnail: string;

  @Prop({ type: String, default: null })
  readonly desc: string;

  @Prop({ type: Number, required: true })
  readonly price: number;

  @Prop({ type: Number, required: true })
  readonly quantity: number;

  @Prop({ type: String, enum: ProductType, required: true })
  readonly type: ProductType;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  readonly attributes: Record<string, any>;

  @Prop({ type: Boolean, default: true })
  readonly isPublished: boolean;
}

export type ProductDocument = Product & HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
