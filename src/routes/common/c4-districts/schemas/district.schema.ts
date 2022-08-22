import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { collectionNames } from 'src/config/collections/collectionName';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: collectionNames.district.schemaName,
})
export class District {
  @Prop({
    type: Types.ObjectId,
    ref: collectionNames.province.ref,
    required: true,
  })
  readonly idProvince: string;

  @Prop({ type: String, required: true })
  readonly name: string;

  @Prop({ type: String, default: 'district' })
  readonly type: string;

  @Prop({ type: String, slug: 'name', })
  readonly slug: string;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);
