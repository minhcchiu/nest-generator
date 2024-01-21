import { Types } from "mongoose";
import { LanguageEnum } from "src/enums/language.enum";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetLanguage } from "~decorators/language.decorator";
import { Public } from "~decorators/public.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

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
import { ApiTags } from "@nestjs/swagger";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@HttpCode(HttpStatus.CREATED)
	@Public()
	@Post()
	async create(@Body() body: CreateNotificationDto) {
		return this.notificationService.createNotification(body);
	}
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateNotificationDto,
	) {
		return this.notificationService.updateById(id, body);
	}

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.notificationService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.notificationService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(
		@GetAqp() { filter, ...options }: AqpDto,
		@GetLanguage() language: LanguageEnum,
	) {
		const pagination = await this.notificationService.paginate(filter, options);

		pagination.docs.forEach((item) => {
			this.notificationService.addNotificationDetail(item, language);
		});

		return pagination;
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.notificationService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
		@GetLanguage() language: LanguageEnum,
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
}
