import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { PaginationDto } from "~common/dto/pagination.dto";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { AnswerService } from "~modules/questions-modules/1-answers/answer.service";
import { CreateQuestionDto } from "~modules/questions-modules/1-questions/dto/create-question.dto";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";
import { Question, QuestionDocument } from "./schemas/question.schema";

@Injectable()
export class QuestionService extends BaseService<QuestionDocument> {
  private questionService: QuestionService;
  constructor(
    @InjectModel(Question.name) model: Model<QuestionDocument>,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AnswerService))
    private readonly answerService: AnswerService,
  ) {
    super(model);

    this.questionService = this;
  }

  async paginateQuestionsAnsweredBy(userId: ObjectId, { filter, ...options }: PaginationDto) {
    const answeredQuestionIds = await this.answerService.distinct("questionId", {
      authorId: userId,
    });

    return this.questionService.paginate(
      {
        ...filter,
        _id: { $in: answeredQuestionIds },
      },
      options,
    );
  }

  async createQuestion(input: CreateQuestionDto) {
    // Create tags
    if (input.tags?.length) {
      const tagIds = await this.tagService.createTags(input.tags);
      input.tagIds = tagIds.map(tag => tag._id);
    }

    const questionCreated = await this.questionService.create(input);

    // Increase question count
    this.userService.increaseQuestionsCount(questionCreated.authorId);

    return questionCreated;
  }

  async bulkDeleteByIds(questionIds: ObjectId[]) {
    const tagIds = await this.questionService.distinct("tagIds", { _id: { $in: questionIds } });
    this.tagService.increaseQuestionCount(tagIds, -1);

    const deleted = await this.questionService.deleteMany({ _id: { $in: questionIds } });

    return deleted;
  }

  async increaseAnswerCount(questionId: ObjectId[], amount: number = 1) {
    return this.questionService.updateMany(
      { _id: { $in: questionId } },
      { $inc: { answerCount: amount } },
    );
  }

  async increaseVote(
    questionId: ObjectId[],
    input: {
      upvote: number;
      downvote: number;
    },
  ) {
    return this.questionService.updateMany(
      { _id: { $in: questionId } },
      { $inc: { upvoteCount: input.upvote, downvoteCount: input.downvote } },
    );
  }

  async increaseView(questionId: ObjectId, amount = 1) {
    return this.questionService.updateById(questionId, {
      $inc: { views: amount },
    });
  }
}
