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
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdsToObjectId } from "src/utils/stringId_to_objectId";
import { GetCurrentUserId } from "~common/decorators/get-current-user-id.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { UpdateActionEnum } from "~modules/questions-modules/1-questions/enums/update-action.enum";
import { VoteActionEnum } from "~modules/questions-modules/1-questions/enums/vote-action.enum";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionService } from "./question.service";

@Controller("questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.questionService.findMany(filter, options);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.questionService.paginate(filter, options);
  }

  @Public()
  @Get("/answered-by/:userId/paginate")
  @HttpCode(HttpStatus.OK)
  async getQuestionsAnsweredBy(
    @Param("userId", ParseObjectIdPipe) userId: ObjectId,
    @GetAqp() query: PaginationDto,
  ) {
    return this.questionService.paginateQuestionsAnsweredBy(userId, query);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.questionService.findById(id, { projection, populate });
  }

  // ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUserId() authorId: ObjectId, @Body() body: CreateQuestionDto) {
    return this.questionService.createQuestion({ authorId, ...body });
  }

  // ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateQuestionDto) {
    return this.questionService.updateById(id, body);
  }

  @Patch("/:questionId/:action/save")
  @HttpCode(HttpStatus.OK)
  async handleSave(
    @GetCurrentUserId() userId: ObjectId,
    @Param("questionId", ParseObjectIdPipe) questionId: ObjectId,
    @Param("action", new ParseEnumPipe(UpdateActionEnum))
    action: UpdateActionEnum,
  ) {
    return this.questionService.handleSave(userId, questionId, action);
  }

  @Patch("/:questionId/:action")
  @HttpCode(HttpStatus.OK)
  async handleVote(
    @GetCurrentUserId() userId: ObjectId,
    @Param("questionId", ParseObjectIdPipe) questionId: ObjectId,
    @Param("action", new ParseEnumPipe(VoteActionEnum))
    action: VoteActionEnum,
  ) {
    return this.questionService.handleVote(userId, questionId, action);
  }

  // ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.questionService.bulkDeleteByIds(stringIdsToObjectId(ids.split(",")));
  }
}
