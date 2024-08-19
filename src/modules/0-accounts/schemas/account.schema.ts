import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "accounts",
})
export class Account {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  plainId?: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  userId: Types.ObjectId;
}

export type AccountDocument = Account & HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);
