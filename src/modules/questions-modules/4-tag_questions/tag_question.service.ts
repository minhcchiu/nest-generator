import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TagQuestion, TagQuestionDocument } from "./schemas/tag_question.schema";

@Injectable()
export class TagQuestionService extends BaseService<TagQuestionDocument> {
  constructor(@InjectModel(TagQuestion.name) model: Model<TagQuestionDocument>) {
    super(model);
  }
}
