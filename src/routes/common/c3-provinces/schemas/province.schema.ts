import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { collectionNames } from 'src/config/collections/collectionName';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: collectionNames.province.schemaName,
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
