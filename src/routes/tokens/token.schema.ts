import { HydratedDocument, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'tokens',
})
export class Token {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  resetPasswordToken: string;
}

const TokenSchema = SchemaFactory.createForClass(Token);

export { TokenDocument, TokenSchema };
