import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import {
	Conversation,
	ConversationDocument,
} from "./schemas/conversation.schema";

@Injectable()
export class ConversationService extends BaseService<ConversationDocument> {
	constructor(
		@InjectModel(Conversation.name) model: PaginateModel<ConversationDocument>,
	) {
		super(model);
	}
}
