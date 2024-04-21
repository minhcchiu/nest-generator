import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { News, NewsDocument } from "./schemas/news.schema";
@Injectable()
export class NewsService extends BaseService<NewsDocument> {
	constructor(@InjectModel(News.name) model: PaginateModel<NewsDocument>) {
		super(model);
	}
}
