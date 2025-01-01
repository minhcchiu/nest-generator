import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionModule } from "~modules/questions-modules/1-questions/question.module";
import { InteractionModule } from "~modules/questions-modules/4-interactions/interaction.module";
import { AnswerController } from "./answer.controller";
import { AnswerService } from "./answer.service";
import { Answer, AnswerSchema } from "./schemas/answer.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Answer.name,
        schema: AnswerSchema,
      },
    ]),
    forwardRef(() => QuestionModule),
    forwardRef(() => InteractionModule),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
