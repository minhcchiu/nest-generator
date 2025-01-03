import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UserService } from "~modules/pre-built/1-users/user.service";
import { AnswerDocument } from "~modules/questions-modules/1-answers/schemas/answer.schema";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { QuestionDocument } from "~modules/questions-modules/1-questions/schemas/question.schema";
import { ReputationValue } from "~utils/constant";
import { Interaction, InteractionDocument } from "./schemas/interaction.schema";

@Injectable()
export class InteractionService extends BaseService<InteractionDocument> {
  private interactionService: InteractionService;
  constructor(
    @InjectModel(Interaction.name) model: Model<InteractionDocument>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {
    super(model);

    this.interactionService = this;
  }

  async viewQuestion(userId: ObjectId, questionId: ObjectId) {
    const interaction = await this.interactionService.updateOne(
      { userId, questionId, action: "view" },
      { userId, questionId, action: "view", $inc: { actionCount: 1 } },
      { upsert: true, new: true },
    );

    Promise.allSettled([
      this.questionService.increaseView(questionId),
      this.userService.increaseReputation(userId, ReputationValue.viewQuestion),
    ]).catch(() => {
      // do nothing
    });

    return interaction;
  }

  async createQuestion(questionCreated: QuestionDocument) {
    const interaction = await this.interactionService.create({
      userId: questionCreated.authorId,
      questionId: questionCreated._id,
      action: "ask_question",
      tagIds: questionCreated.tagIds,
    });

    return interaction;
  }

  async createAnswer(answer: AnswerDocument) {
    const interaction = await this.interactionService.create({
      userId: answer.authorId,
      questionId: answer.questionId,
      answerId: answer._id,
      action: "answer",
    });

    return interaction;
  }

  async bulkDeleteByAnswerIds(answerIds: ObjectId[]) {
    const deleted = await this.interactionService.deleteMany({
      answerId: { $in: answerIds },
    });

    return deleted;
  }

  async bulkDeleteByQuestionIds(questionIds: ObjectId[]) {
    const deleted = await this.interactionService.deleteMany({
      questionId: { $in: questionIds },
    });

    return deleted;
  }
}
