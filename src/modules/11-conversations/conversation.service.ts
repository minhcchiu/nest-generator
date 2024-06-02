import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import {
	Conversation,
	ConversationDocument,
} from "./schemas/conversation.schema";

@Injectable()
export class ConversationService extends BaseService<ConversationDocument> {
	constructor(
		@InjectModel(Conversation.name) model: Model<ConversationDocument>,
	) {
		super(model);
	}
}
