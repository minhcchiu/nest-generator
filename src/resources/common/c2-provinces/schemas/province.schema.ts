import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.province.name,
})
export class Province {
  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'province' })
  readonly type: string;

  @Prop({ type: String, slug: 'name', unique: true })
  readonly slug: string;
}

export type ProvinceDocument = Province & Document;
export const ProvinceSchema = SchemaFactory.createForClass(Province);
