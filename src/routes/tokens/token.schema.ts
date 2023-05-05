import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'tokens',
})
export class Token {
  @Prop({ type: ObjectId, ref: 'User', index: 1 })
  user: string;

  @Prop({ type: String, required: true, index: 1 })
  token: string;

  @Prop({ type: String })
  expiresAt: string;
}

const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ expiresAt: 1 }, { expires: '50d' });

export { TokenDocument, TokenSchema };
