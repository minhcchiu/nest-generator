import { dbCollections } from '~config/collections/schemas.collection';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.banner.name,
})
export class Banner {
  @Prop({ type: String, required: true })
  readonly image: string;

  @Prop({ type: Number, default: 0 })
  readonly position: number;

  @Prop({ type: String, default: '' })
  readonly title: string;

  @Prop({ type: String, default: '' })
  readonly link: string;

  @Prop({ type: String, default: '' })
  readonly description: string;

  @Prop({ type: Boolean, default: false })
  readonly isActive: boolean;
}

export type BannerDocument = Banner & Document;
export const BannerSchema = SchemaFactory.createForClass(Banner);
