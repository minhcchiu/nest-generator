import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String })
  readonly name: string;

  @Prop({ type: String })
  readonly position: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  readonly idUser: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
