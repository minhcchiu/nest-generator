import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { ProvinceService } from "./province.service";

@Controller("provinces")
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.provinceService.paginate(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.provinceService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.provinceService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProvinceDto) {
    return this.provinceService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateProvinceDto) {
    return this.provinceService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.provinceService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.provinceService.deleteById(id);
  }
}
