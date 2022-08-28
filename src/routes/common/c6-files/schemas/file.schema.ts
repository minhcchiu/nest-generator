import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { schemas } from '~config/collections/schemas.collection';
import { StorageServiceEnum } from '../enum/storage-service.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: schemas.file.name,
})
export class File {
  @Prop({ type: Types.ObjectId, ref: schemas.user.ref })
  readonly owner: string;

  @Prop({
    type: String,
    enum: StorageServiceEnum,
    default: StorageServiceEnum.LOCAL_DISK,
  })
  readonly storage: StorageServiceEnum;

  @Prop({ type: String, default: '' })
  readonly storageId: string;

  @Prop({ type: Array, default: [] })
  readonly file: string[];

  @Prop({ type: String, default: '' })
  readonly type: string;

  // size in bytes
  @Prop({ type: Number, default: 0 })
  readonly size: number;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
