import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.apiCollection.name,
})
export class ApiCollection {
  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.user.ref,
    required: true,
  })
  readonly userFrom: string;

  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.user.ref,
    required: true,
  })
  readonly userTo: string;

  @Prop({ type: String, required: true })
  readonly type: string;

  @Prop({ type: Types.ObjectId, required: true })
  readonly entityId: string;

  @Prop({ type: String, required: true })
  readonly title: string;

  @Prop({ type: String, default: '' })
  readonly description?: string;

  @Prop({ type: String, default: '' })
  readonly thumbnail?: string;

  @Prop({ type: Boolean, default: false })
  readonly opened?: boolean;
}

export type ApiCollectionDocument = ApiCollection & Document;
export const ApiCollectionSchema = SchemaFactory.createForClass(ApiCollection);
