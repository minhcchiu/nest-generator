import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UserItem, UserItemDocument } from "~modules/user_items/schemas/user_item.schema";

@Injectable()
export class UserItemService extends BaseService<UserItemDocument> {
  constructor(@InjectModel(UserItem.name) model: Model<UserItemDocument>) {
    super(model);
  }
}
