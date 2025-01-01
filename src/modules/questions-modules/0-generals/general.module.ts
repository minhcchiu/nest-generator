import { Module } from "@nestjs/common";
import { AnswerModule } from "~modules/questions-modules/1-answers/answer.module";
import { QuestionModule } from "~modules/questions-modules/1-questions/question.module";
import { TagModule } from "~modules/questions-modules/3-tags/tag.module";
import { InteractionModule } from "~modules/questions-modules/4-interactions/interaction.module";
import { GeneralController } from "./general.controller";
import { GeneralService } from "./general.service";

@Module({
  imports: [QuestionModule, AnswerModule, TagModule, InteractionModule],
  controllers: [GeneralController],
  providers: [GeneralService],
  exports: [GeneralService],
})
export class GeneralModule {}
