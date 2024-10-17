import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Account } from "~modules/0-accounts/schemas/account.schema";
import { Category } from "~modules/0-categories/schemas/category.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "transactions",
})
export class Transaction {
  @Prop({ type: String, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  payee: string;

  @Prop({ type: String })
  note?: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: true })
  accountId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name, required: true })
  categoryId: ObjectId;
}

export type TransactionDocument = Transaction & HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
