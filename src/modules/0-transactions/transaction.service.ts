import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Transaction, TransactionDocument } from "./schemas/transaction.schema";

@Injectable()
export class TransactionService extends BaseService<TransactionDocument> {
  constructor(@InjectModel(Transaction.name) model: Model<TransactionDocument>) {
    super(model);
  }
}
