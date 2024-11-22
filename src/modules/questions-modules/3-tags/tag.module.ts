import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagQuestionModule } from "~modules/questions-modules/4-tag_questions/tag_question.module";
import { Tag, TagSchema } from "./schemas/tag.schema";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
    TagQuestionModule,
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
