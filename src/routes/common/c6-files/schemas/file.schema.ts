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

  @Prop({ type: String, default: 'image' })
  readonly type: string;

  @Prop({ type: String, required: true })
  readonly ext: string;

  @Prop({ type: [String], required: true })
  readonly files: string[];

  @Prop({ type: String, default: 'Awesome-NestJS-generator-2023' })
  readonly folder: string;

  @Prop({ type: String, required: true })
  readonly resourceID: string;

  @Prop({ type: String, default: '' })
  readonly secureUrl?: string;

  @Prop({ type: Number, required: true })
  readonly size: number;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
