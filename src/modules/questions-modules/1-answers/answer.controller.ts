import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { VoteActionEnum } from "~modules/questions-modules/1-questions/enums/vote-action.enum";
import { AnswerService } from "./answer.service";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";

@Controller("answers")
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.answerService.findMany(filter, options);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.answerService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.answerService.findById(id, { projection, populate });
  }

  // ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUserId() authorId: ObjectId, @Body() body: CreateAnswerDto) {
    return this.answerService.createAnswer({ authorId, ...body });
  }

  // ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateAnswerDto) {
    return this.answerService.updateById(id, body);
  }

  @Patch("/:id/:action")
  @HttpCode(HttpStatus.OK)
  async handleVote(
    @GetCurrentUserId() userId: ObjectId,
    @Param("id", ParseObjectIdPipe) answerId: ObjectId,
    @Param("action", new ParseEnumPipe(VoteActionEnum)) action: VoteActionEnum,
  ) {
    const res = await this.answerService.handleVote(action, answerId, userId);

    if (!res) throw new NotFoundException("Answer not found!");

    return res;
  }

  // ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.answerService.bulkDeleteByIds(stringIdsToObjectId(ids.split(",")));
  }
}
