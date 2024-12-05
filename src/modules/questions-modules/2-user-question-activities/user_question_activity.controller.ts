import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetCurrentUserId } from "~common/decorators/get-current-user-id.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { VoteActionEnum } from "~modules/questions-modules/2-user-question-activities/enums/user_question_activity-action.enum";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
import { UserQuestionActivityService } from "./user_question_activity.service";

@Controller("user_question_activities")
export class UserQuestionActivityController {
  constructor(private readonly userQuestionActivityService: UserQuestionActivityService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userQuestionActivityService.paginate(filter, options);
  }

  @Public()
  @Get("/one")
  @HttpCode(HttpStatus.OK)
  async findById(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userQuestionActivityService.findOne(filter, options);
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getMyUserQuestionActivity(
    @GetCurrentUserId() userId: ObjectId,
    @GetAqp() { filter, ...options }: PaginationDto,
  ) {
    return this.userQuestionActivityService.findOne({ userId, ...filter }, options);
  }

  // ----- Method: PATCH -----
  @Patch("/:action")
  @HttpCode(HttpStatus.CREATED)
  async updateActivity(
    @GetCurrentUserId() userId: ObjectId,
    @Param("action", new ParseEnumPipe(VoteActionEnum))
    action: VoteActionEnum,
    @Body("questionId", ParseObjectIdPipe) questionId: ObjectId,
  ) {
    return this.userQuestionActivityService.updateActivity(action, questionId, userId);
  }

  // ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.userQuestionActivityService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
