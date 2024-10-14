import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "~pre-built/1-users/schemas/user.schema";

type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "tokens",
})
export class Token {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, index: 1 })
  userId: ObjectId;

  @Prop({ type: String, required: true, index: 1 })
  token: string;

  @Prop({ type: Number })
  expiresAt: number;
}

const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ expiresAt: 1 }, { expires: "50d" });

export { TokenDocument, TokenSchema };
