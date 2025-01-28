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

  @Prop([
    {
      token: { type: String, required: true },
      tokenId: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
  ])
  tokens: { token: string; expiresAt: Date; tokenId: string }[];

  @Prop({ type: Date, index: { expireAfterSeconds: 0 } })
  expiresAt: Date;
}

const TokenSchema = SchemaFactory.createForClass(Token);

export { TokenDocument, TokenSchema };
