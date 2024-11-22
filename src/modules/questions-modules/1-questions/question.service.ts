import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { CreateQuestionDto } from "~modules/questions-modules/1-questions/dto/create-question.dto";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";
import { Question, QuestionDocument } from "./schemas/question.schema";

@Injectable()
export class QuestionService extends BaseService<QuestionDocument> {
  private questionService: QuestionService;
  constructor(
    @InjectModel(Question.name) model: Model<QuestionDocument>,
    private readonly tagService: TagService,
  ) {
    super(model);

    this.questionService = this;
  }

  async createQuestion(input: CreateQuestionDto) {
    const question = await this.questionService.create(input);

    if (input.tags?.length)
      await this.tagService.createTagsWithQuestionId(question._id, input.tags);

    return question;
  }

  async bulkDeleteByIds(questionIds: ObjectId[]) {
    const deleted = await this.questionService.deleteMany({ _id: { $in: questionIds } });

    await this.tagService.deleteTagsByQuestionIds(questionIds);

    return deleted;
  }
}
