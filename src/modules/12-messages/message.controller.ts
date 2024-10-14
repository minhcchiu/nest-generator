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
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessageService } from "./message.service";

@Controller("categories")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.messageService.findMany(filter, options);
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMessageDto) {
    return this.messageService.create(body);
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateMessageDto) {
    return this.messageService.updateById(id, body);
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.messageService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.messageService.deleteById(id);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.messageService.paginate(filter, options);
  }

  @Public()
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.messageService.count(filter);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.messageService.findById(id, { projection, populate });
  }
}
