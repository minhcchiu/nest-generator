import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionModule } from "~modules/questions-modules/1-questions/question.module";
import {
  UserQuestionActivity,
  UserQuestionActivitySchema,
} from "./schemas/user_question_activity.schema";
import { UserQuestionActivityController } from "./user_question_activity.controller";
import { UserQuestionActivityService } from "./user_question_activity.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserQuestionActivity.name,
        schema: UserQuestionActivitySchema,
      },
    ]),
    forwardRef(() => QuestionModule),
  ],
  controllers: [UserQuestionActivityController],
  providers: [UserQuestionActivityService],
  exports: [UserQuestionActivityService],
})
export class UserQuestionActivityModule {}
