import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { QuestionService } from "~modules/questions-modules/1-questions/question.service";

import { VoteActionEnum } from "~modules/questions-modules/2-user-question-activities/enums/user_question_activity-action.enum";
import {
  UserQuestionActivity,
  UserQuestionActivityDocument,
} from "./schemas/user_question_activity.schema";

@Injectable()
export class UserQuestionActivityService extends BaseService<UserQuestionActivityDocument> {
  private userQuestionActivityService: UserQuestionActivityService;
  constructor(
    @InjectModel(UserQuestionActivity.name) model: Model<UserQuestionActivityDocument>,
    private questionService: QuestionService,
  ) {
    super(model);

    this.userQuestionActivityService = this;
  }

  async seedUserQuestionActivity(userId: ObjectId) {
    return this.userQuestionActivityService.updateOne({ userId }, { userId }, { upsert: true });
  }

  async updateActivity(action: VoteActionEnum, questionId: ObjectId, userId: ObjectId) {
    switch (action) {
      case VoteActionEnum.Upvote:
      case VoteActionEnum.Downvote:
      case VoteActionEnum.Unvoted:
        return this._handleVote(action, questionId, userId);

      case VoteActionEnum.Save:
      case VoteActionEnum.Unsaved:
        return this._handleSave(action, questionId, userId);
    }
  }

  private async _handleVote(action: VoteActionEnum, questionId: ObjectId, userId: ObjectId) {
    const userActivity: UserQuestionActivityDocument =
      await this.userQuestionActivityService.findOne({ userId });
    const isDownVoted = userActivity.downVotedQuestions.some(
      id => id.toString() === questionId.toString(),
    );
    const isUpvoted = userActivity.votedQuestions.some(
      id => id.toString() === questionId.toString(),
    );

    const updateOperations: Record<string, any> = {};
    const voteChanges = { upvote: 0, downvote: 0 };

    switch (action) {
      case VoteActionEnum.Upvote: {
        if (isDownVoted) {
          updateOperations.$pull = { downVotedQuestions: questionId };
          voteChanges.downvote = -1;
        }

        updateOperations.$push = { votedQuestions: questionId };
        voteChanges.upvote = 1;

        break;
      }

      case VoteActionEnum.Downvote: {
        if (isUpvoted) {
          updateOperations.$pull = { votedQuestions: questionId };
          voteChanges.upvote = -1;
        }

        updateOperations.$push = { downVotedQuestions: questionId };
        voteChanges.downvote = 1;

        break;
      }

      case VoteActionEnum.Unvoted: {
        updateOperations.$pull = { votedQuestions: questionId, downVotedQuestions: questionId };

        if (isDownVoted) voteChanges.downvote = -1;
        else if (isUpvoted) voteChanges.upvote = -1;

        break;
      }
    }

    // Update voted count in questions
    await this.questionService.increaseVote([questionId], voteChanges);

    return this.userQuestionActivityService.updateById(userActivity._id, updateOperations);
  }

  private async _handleSave(action: VoteActionEnum, questionId: ObjectId, userId: ObjectId) {
    switch (action) {
      case VoteActionEnum.Save: {
        return this.userQuestionActivityService.updateOne(
          { userId },
          { $push: { savedQuestions: questionId } },
        );
      }

      case VoteActionEnum.Unsaved: {
        return this.userQuestionActivityService.updateOne(
          { userId },
          { $pull: { savedQuestions: questionId } },
        );
      }
    }
  }
}
