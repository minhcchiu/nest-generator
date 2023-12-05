import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";
import { Types } from "mongoose";
import { GetLanguage } from "~decorators/language.decorator";
import { LanguageEnum } from "src/enums/language.enum";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@HttpCode(201)
	@Public()
	@Post()
	async create(@Body() body: CreateNotificationDto) {
		return this.notificationService.createNotification(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateNotificationDto,
	) {
		return this.notificationService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.notificationService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.notificationService.deleteById(id);
	}

	@Public()
	@Get("paginate")
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
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.notificationService.count(filter);
	}

	@Public()
	@Get(":id")
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
