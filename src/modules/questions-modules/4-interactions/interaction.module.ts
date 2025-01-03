import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionModule } from "~modules/questions-modules/1-questions/question.module";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";
import { Interaction, InteractionSchema } from "./schemas/interaction.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Interaction.name,
        schema: InteractionSchema,
      },
    ]),
    forwardRef(() => QuestionModule),
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
  exports: [InteractionService],
})
export class InteractionModule {}
