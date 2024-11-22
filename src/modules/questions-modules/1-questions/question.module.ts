import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagModule } from "~modules/questions-modules/3-tags/tag.module";
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
    TagModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
