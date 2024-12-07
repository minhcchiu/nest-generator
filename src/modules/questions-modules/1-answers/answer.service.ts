import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { CreateAnswerDto } from "~modules/questions-modules/1-answers/dto/create-answer.dto";
import { VoteActionEnum } from "~modules/questions-modules/1-answers/enums/vote-action-type.enum";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { Answer, AnswerDocument } from "./schemas/answer.schema";

@Injectable()
export class AnswerService extends BaseService<AnswerDocument> {
  private answerService: AnswerService;
  constructor(
    @InjectModel(Answer.name) model: Model<AnswerDocument>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
  ) {
    super(model);

    this.answerService = this;
  }

  async createAnswer(input: CreateAnswerDto) {
    const answerCreated = await this.answerService.create(input);

    this.questionService.increaseAnswerCount([input.questionId], 1);

    return answerCreated;
  }

  async bulkDeleteByIds(answerIds: ObjectId[]) {
    const questionIds = await this.answerService.distinct("questionId", {
      _id: { $in: answerIds },
    });

    this.questionService.increaseAnswerCount(questionIds, -1);

    const deleted = await this.answerService.deleteMany({ _id: { $in: answerIds } });

    return deleted;
  }

  async updateVote(action: VoteActionEnum, answerId: ObjectId, userId: ObjectId) {
    switch (action) {
      case VoteActionEnum.Upvote:
        return this.answerService.updateById(answerId, {
          $addToSet: { upvotes: userId },
          $pull: { downvotes: userId },
        });

      case VoteActionEnum.Downvote:
        return this.answerService.updateById(answerId, {
          $pull: { upvotes: userId },
          $addToSet: { downvotes: userId },
        });

      case VoteActionEnum.Unvoted:
        return this.answerService.updateById(answerId, {
          $pull: { upvotes: userId, downvotes: userId },
        });
    }
  }
}
