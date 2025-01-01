import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Account, AccountDocument } from "./schemas/account.schema";

@Injectable()
export class AccountService extends BaseService<AccountDocument> {
  constructor(@InjectModel(Account.name) model: Model<AccountDocument>) {
    super(model);
  }
}
