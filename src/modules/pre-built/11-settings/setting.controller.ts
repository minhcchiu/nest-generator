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
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateSettingDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";
import { UpdateSettingDto } from "~modules/pre-built/11-settings/dto/update-setting.dto";
import { SettingService } from "~modules/pre-built/11-settings/setting.service";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

@Controller("settings")
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("one")
  @HttpCode(HttpStatus.OK)
  async findOne(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.settingService.findOne(filter, options);
  }

  @Public()
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.settingService.findById(id, { projection, populate });
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateSettingDto) {
    return this.settingService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateSettingDto) {
    return this.settingService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.settingService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
