import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagQuestion, TagQuestionSchema } from "./schemas/tag_question.schema";
import { TagQuestionController } from "./tag_question.controller";
import { TagQuestionService } from "./tag_question.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TagQuestion.name,
        schema: TagQuestionSchema,
      },
    ]),
  ],
  controllers: [TagQuestionController],
  providers: [TagQuestionService],
  exports: [TagQuestionService],
})
export class TagQuestionModule {}
