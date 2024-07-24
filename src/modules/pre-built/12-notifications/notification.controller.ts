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

import { Types } from "mongoose";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetLanguage } from "~decorators/language.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { LanguageCodeEnum } from "~enums/language.enum";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //  ----- Method: GET -----
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(
    @GetAqp() { filter, ...options }: PaginationDto,
    @GetLanguage() language: LanguageCodeEnum,
  ) {
    const pagination = await this.notificationService.paginate(filter, options);

    pagination.data.forEach(item => {
      this.notificationService.addNotificationDetail(item, language);
    });

    return pagination;
  }

  @Get("/count")
  @HttpCode(HttpStatus.OK)
  async count(@GetAqp("filter") filter: PaginationDto) {
    return this.notificationService.count(filter);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
    @GetLanguage() language: LanguageCodeEnum,
  ) {
    const notification = await this.notificationService.findById(id, {
      projection,
      populate,
    });

    if (notification)
      // add notification detail
      this.notificationService.addNotificationDetail(notification, language);

    return notification;
  }

  //  ----- Method: POST -----
  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  async create(@Body() body: CreateNotificationDto) {
    return this.notificationService.createNotification(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id", ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateNotificationDto,
  ) {
    return this.notificationService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/ids")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.notificationService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
    return this.notificationService.deleteById(id);
  }
}
