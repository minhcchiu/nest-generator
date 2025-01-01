import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.commentService.findMany(filter, options);
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUserId() userId: ObjectId, @Body() body: CreateCommentDto) {
    return this.commentService.create({ ...body, authorId: userId });
  }
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateCommentDto) {
    return this.commentService.updateById(id, body);
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.commentService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.commentService.deleteById(id);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.commentService.paginate(filter, options);
  }

  @Public()
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.commentService.count(filter);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.commentService.findById(id, { projection, populate });
  }
}
