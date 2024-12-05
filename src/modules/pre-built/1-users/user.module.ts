import { forwardRef, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserQuestionActivityModule } from "~modules/questions-modules/2-user-question-activities/user_question_activity.module";
import { TagModule } from "~modules/questions-modules/3-tags/tag.module";
import { HashingService } from "./hashing/hashing.service";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => TagModule),
    forwardRef(() => UserQuestionActivityModule),
  ],
  controllers: [UserController],
  providers: [UserService, HashingService],
  exports: [UserService],
})
export class UserModule {}
