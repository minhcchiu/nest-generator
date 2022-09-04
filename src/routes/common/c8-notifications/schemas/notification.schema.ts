import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { schemas } from '~config/collections/schemas.collection';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: schemas.notification.name,
})
export class Notification {
  @Prop({ type: Types.ObjectId, ref: schemas.user.ref, required: true })
  readonly userTo: string;

  @Prop({ type: Types.ObjectId, ref: schemas.user.ref, required: true })
  readonly userFrom: string;

  @Prop({ type: String, required: true })
  readonly type: string;

  @Prop({ type: Boolean, default: false })
  opened: boolean;

  @Prop({ type: Types.ObjectId, required: true })
  entityId: string;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
