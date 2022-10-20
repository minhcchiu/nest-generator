import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.transaction.name,
})
export class Transaction {
  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.user.ref,
    required: true,
  })
  readonly userTo: string;

  @Prop({
    type: Types.ObjectId,
    ref: dbCollections.user.ref,
    required: true,
  })
  readonly userFrom: string;

  @Prop({ type: String, required: true })
  readonly type: string;

  @Prop({ type: Boolean, default: false })
  readonly opened: boolean;

  @Prop({ type: Types.ObjectId, required: true })
  readonly entityId: string;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
