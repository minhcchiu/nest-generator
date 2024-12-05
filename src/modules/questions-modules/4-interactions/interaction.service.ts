import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";
import { Interaction, InteractionDocument } from "./schemas/interaction.schema";

@Injectable()
export class InteractionService extends BaseService<InteractionDocument> {
  private interactionService: InteractionService;
  constructor(
    @InjectModel(Interaction.name) model: Model<InteractionDocument>,
    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
  ) {
    super(model);

    this.interactionService = this;
  }

  async viewQuestion(userId: ObjectId, questionId: ObjectId) {
    await this.questionService.increaseView(questionId);

    return this.interactionService.updateOne(
      { userId, questionId, action: "view" },
      { userId, questionId, action: "view" },
      { upsert: true },
    );
  }
}
