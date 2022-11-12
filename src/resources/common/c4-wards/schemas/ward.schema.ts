import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.ward.name,
})
export class Ward {
  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.province.ref,
    required: true,
  })
  readonly idProvince: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.district.ref,
  })
  readonly idDistrict: Types.ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'ward' })
  readonly type: string;

  @Prop({ type: String, slug: 'name' })
  readonly slug: string;
}

export type WardDocument = Ward & Document;
export const WardSchema = SchemaFactory.createForClass(Ward);
