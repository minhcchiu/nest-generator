import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { PaginationDto } from "~common/dto/pagination.dto";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { AnswerService } from "~modules/questions-modules/1-answers/answer.service";
import { CreateQuestionDto } from "~modules/questions-modules/1-questions/dto/create-question.dto";
import { UpdateActionEnum } from "~modules/questions-modules/1-questions/enums/update-action.enum";
import { VoteActionEnum } from "~modules/questions-modules/1-questions/enums/vote-action.enum";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";
import { InteractionService } from "~modules/questions-modules/4-interactions/interaction.service";
import { aggregateCounts } from "~utils/common.util";
import { ReputationValue } from "~utils/constant";
import { isObjectIdInList, stringIdToObjectId } from "~utils/stringId_to_objectId";
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
    @Inject(forwardRef(() => InteractionService))
    private readonly interactionService: InteractionService,
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

    Promise.allSettled([
      this.interactionService.createQuestion(questionCreated),
      this.userService.increaseQuestionsCount(questionCreated.authorId),
    ]).catch(() => {
      // do nothing
    });

    return questionCreated;
  }

  async handleSave(userId: ObjectId, questionId: ObjectId, action: UpdateActionEnum) {
    const option = action === UpdateActionEnum.Add ? "$addToSet" : "$pull";

    return this.userService.updateById(userId, {
      [option]: {
        savedQuestionIds: questionId,
      },
    });
  }

  async handleVote(userId: ObjectId, questionId: ObjectId, action: VoteActionEnum) {
    const user = await this.userService.findById(userId);
    const hasVoted = isObjectIdInList(questionId, user.upvoteQuestionIds);
    const hasDownvoted = isObjectIdInList(questionId, user.downvoteQuestionIds);

    const questionItem = {
      upvoteCount: 0,
      downvoteCount: 0,
    };

    switch (action) {
      case VoteActionEnum.Upvote:
        if (hasVoted) throw new BadRequestException("You have already upvoted this question.");

        user.upvoteQuestionIds.push(questionId);
        questionItem.upvoteCount = 1;

        if (hasDownvoted) {
          user.downvoteQuestionIds = user.downvoteQuestionIds.filter(
            id => id.toString() !== questionId.toString(),
          );
          questionItem.downvoteCount = -1;
        }

        break;

      case VoteActionEnum.Downvote:
        if (hasDownvoted) throw new BadRequestException("You have already upvoted this question.");

        user.downvoteQuestionIds.push(questionId);
        questionItem.downvoteCount = 1;

        if (hasVoted) {
          user.upvoteQuestionIds = user.upvoteQuestionIds.filter(
            id => id.toString() !== questionId.toString(),
          );
          questionItem.upvoteCount = -1;
        }

        break;

      case VoteActionEnum.Unvoted:
        if (hasVoted) {
          user.upvoteQuestionIds = user.upvoteQuestionIds.filter(
            id => id.toString() !== questionId.toString(),
          );
          questionItem.upvoteCount = -1;
        } else if (hasDownvoted) {
          user.downvoteQuestionIds = user.downvoteQuestionIds.filter(
            id => id.toString() !== questionId.toString(),
          );
          questionItem.downvoteCount = -1;
        } else {
          throw new BadRequestException("You have not voted this question.");
        }
        break;
    }

    const [question] = await Promise.all([
      this.questionService.updateById(questionId, { $inc: questionItem }),
      user.save(),
    ]);

    this.userService
      .increaseReputation(question.authorId, ReputationValue.upvoteQuestion)
      .catch(() => {
        // do nothing
      });

    return question;
  }

  async bulkDeleteByIds(questionIds: ObjectId[]) {
    await this._processAnswerDeletions({ _id: { $in: questionIds } });

    return this.questionService.deleteMany({ _id: { $in: questionIds } });
  }

  async increaseAnswerCount(questionId: ObjectId, amount: number = 1) {
    return this.questionService.updateById(questionId, { $inc: { answerCount: amount } });
  }

  async increaseView(questionId: ObjectId, amount = 1) {
    return this.questionService.updateById(questionId, {
      $inc: { views: amount },
    });
  }

  private async _processAnswerDeletions(filter: Record<string, any>) {
    const questionsDeleted = await this.questionService.findMany(filter);

    const questionIds = questionsDeleted.map(question => question._id);
    const tagIdsWithCount = aggregateCounts(questionsDeleted.flatMap(question => question.tagIds));
    const authorIdsWithCount = aggregateCounts(questionsDeleted.map(question => question.authorId));

    Promise.all([
      ...tagIdsWithCount.map(tag =>
        this.tagService.increaseQuestionCount(stringIdToObjectId(tag.item), -tag.count),
      ),
      ...authorIdsWithCount.map(author =>
        this.userService.increaseQuestionsCount(stringIdToObjectId(author.item), -author.count),
      ),
      this.answerService.bulkDeleteByQuestionIds(questionIds),
      this.interactionService.bulkDeleteByQuestionIds(questionIds),
    ]);
  }
}
