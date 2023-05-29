import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'wards',
})
export class Ward {
  @Prop({
    type: ObjectId,
    ref: 'Province',
    required: true,
  })
  readonly idProvince: ObjectId;

  @Prop({
    type: ObjectId,
    ref: 'District',
  })
  readonly idDistrict: ObjectId;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'ward' })
  readonly type: string;

  @Prop({ type: String, slug: 'name' })
  readonly slug: string;
}

export type WardDocument = Ward & Document;
export const WardSchema = SchemaFactory.createForClass(Ward);
