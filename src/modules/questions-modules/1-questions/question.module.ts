import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnswerModule } from "~modules/questions-modules/1-answers/answer.module";
import { TagModule } from "~modules/questions-modules/3-tags/tag.module";
import { InteractionModule } from "~modules/questions-modules/4-interactions/interaction.module";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { Question, QuestionSchema } from "./schemas/question.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
    ]),
    forwardRef(() => TagModule),
    forwardRef(() => AnswerModule),
    InteractionModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
