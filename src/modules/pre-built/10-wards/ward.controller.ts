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
import { CreateWardDto } from "./dto/create-ward.dto";
import { UpdateWardDto } from "./dto/update-ward.dto";
import { WardService } from "./ward.service";

@Controller("wards")
export class WardController {
  constructor(private readonly wardService: WardService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.wardService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.wardService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.wardService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateWardDto) {
    return this.wardService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateWardDto) {
    return this.wardService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.wardService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.wardService.deleteById(id);
  }
}
