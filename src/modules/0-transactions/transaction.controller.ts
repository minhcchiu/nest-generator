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
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // ----- Method: GET -----
  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.transactionService.findMany(filter, options);
  }

  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.transactionService.paginate(filter, options);
  }

  @Public()
  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.transactionService.count(filter);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.transactionService.findById(id, { projection, populate });
  }

  // ----- Method: POST -----
  @Post("/bulk")
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body() body: CreateTransactionDto[]) {
    return this.transactionService.createMany(body);
  }

  // @Public()
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateTransactionDto) {
    return this.transactionService.create(body);
  }

  // ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateTransactionDto) {
    return this.transactionService.updateById(id, body);
  }

  // ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.transactionService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.transactionService.deleteById(id);
  }
}
