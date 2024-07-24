import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Message, MessageDocument } from "./schemas/message.schema";

@Injectable()
export class MessageService extends BaseService<MessageDocument> {
  constructor(@InjectModel(Message.name) model: Model<MessageDocument>) {
    super(model);
  }
}
