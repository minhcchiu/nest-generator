import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { CreateAnswerDto } from "~modules/questions-modules/1-answers/dto/create-answer.dto";
import { VoteActionEnum } from "~modules/questions-modules/1-questions/enums/vote-action.enum";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { InteractionService } from "~modules/questions-modules/4-interactions/interaction.service";
import { ReputationValue } from "~utils/constant";
import { isObjectIdInList } from "~utils/stringId_to_objectId";
import { Answer, AnswerDocument } from "./schemas/answer.schema";

@Injectable()
export class AnswerService extends BaseService<AnswerDocument> {
  private answerService: AnswerService;
  constructor(
    @InjectModel(Answer.name) model: Model<AnswerDocument>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
    private readonly interactionService: InteractionService,
    private readonly userService: UserService,
  ) {
    super(model);

    this.answerService = this;
  }

  async createAnswer(input: CreateAnswerDto) {
    const answerCreated = await this.answerService.create(input);

    Promise.allSettled([
      this.questionService.increaseAnswerCount(input.questionId, 1),
      this.interactionService.createAnswer(answerCreated),
      this.userService.increaseAnswersCount(answerCreated.authorId),
    ]).catch(() => {
      // do nothing
    });

    return answerCreated;
  }

  async bulkDeleteByIds(answerIds: ObjectId[]) {
    await this._processAnswerDeletions({ _id: { $in: answerIds } });

    return this.answerService.deleteMany({ _id: { $in: answerIds } });
  }

  async bulkDeleteByQuestionIds(questionIds: ObjectId[]) {
    await this._processAnswerDeletions({ questionId: { $in: questionIds } });

    return this.answerService.deleteMany({ questionId: { $in: questionIds } });
  }

  private async _processAnswerDeletions(filter: Record<string, any>) {
    // Aggregate answers based on the filter
    const answers = await this.answerService.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$questionId",
          authorId: { $first: "$authorId" },
          count: { $sum: 1 },
          answerIds: { $push: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$authorId",
          count: 1,
          questionId: "$_id",
          answerIds: 1,
        },
      },
    ]);

    // Prepare and execute update promises
    const updatePromises = answers.flatMap(answer => [
      this.questionService.increaseAnswerCount(answer.questionId, -answer.count),
      this.interactionService.bulkDeleteByAnswerIds(answer.answerIds),
      this.userService.increaseAnswersCount(answer.authorId, -answer.count),
    ]);

    await Promise.allSettled(updatePromises);
  }

  async handleVote(action: VoteActionEnum, answerId: ObjectId, userId: ObjectId) {
    const answer = await this.answerService.findById(answerId);
    if (!answer) throw new NotFoundException("Answer not found!");

    const hasUpvoted = isObjectIdInList(userId, answer.upvotes);
    const hasDownvoted = isObjectIdInList(userId, answer.downvotes);

    const updatedItem: Record<string, any> = {};
    let reputationForUser = 0;
    let reputationForAuthor = 0;

    switch (action) {
      case VoteActionEnum.Upvote:
        updatedItem.$addToSet = { upvotes: userId };
        reputationForAuthor = ReputationValue.upvoteAnswer;
        reputationForUser = 2;

        if (hasDownvoted) {
          updatedItem.$pull = { downvotes: userId };
          reputationForAuthor += ReputationValue.upvoteAnswer;
          reputationForUser -= 2;
        }
        break;

      case VoteActionEnum.Downvote:
        updatedItem.$addToSet = { downvotes: userId };
        reputationForAuthor = ReputationValue.upvoteAnswer;

        if (hasUpvoted) {
          updatedItem.$pull = { upvotes: userId };
          reputationForAuthor -= ReputationValue.upvoteAnswer;
        }
        break;

      case VoteActionEnum.Unvoted:
        if (hasUpvoted) {
          updatedItem.$pull = { upvotes: userId };
          reputationForAuthor -= ReputationValue.upvoteAnswer;
          reputationForUser = -2;
        }

        if (hasDownvoted) {
          updatedItem.$pull = { downvotes: userId };
          reputationForAuthor -= ReputationValue.upvoteAnswer;
          reputationForUser = -2;
        }

        break;
    }

    Promise.allSettled([
      this.userService.increaseReputation(userId, reputationForUser),
      this.userService.increaseReputation(answer.authorId, reputationForAuthor),
    ]).catch(() => {
      // do nothing
    });

    return this.answerService.updateById(answerId, updatedItem);
  }
}
