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
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  payee: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Date, required: true })
  date: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: true })
  accountId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  categoryId: ObjectId;
}

export type TransactionDocument = Transaction & HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
