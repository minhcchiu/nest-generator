import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { dbCollections } from '~config/collections/schemas.collection';
import { StorageServiceEnum } from '../enum/storage-service.enum';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: dbCollections.file.name,
})
export class File {
  @Prop({ type: Types.ObjectId, ref: dbCollections.user.ref })
  readonly owner: string;

  @Prop({
    type: String,
    enum: StorageServiceEnum,
    unique: true,
    required: true,
  })
  readonly storage: StorageServiceEnum;

  @Prop({ type: String, required: true })
  readonly type: string;

  @Prop({ type: [{ type: String }], required: true })
  readonly files: string[];

  @Prop({ type: String, default: 'Awesome-NestJS-generator-2023' })
  readonly folder: string;

  @Prop({ type: String, required: true })
  readonly resourceID: string;

  @Prop({ type: String, default: '' })
  readonly secureUrl?: string;

  @Prop({ type: Number, required: true })
  readonly size: number;

  @Prop({ unique: true, type: Number, required: true })
  readonly sizes: number;

  @Prop({ unique: true, type: Number, required: true })
  readonly list: number;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
