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

import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { SettingService } from "./setting.service";
import { Types } from "mongoose";

@ApiTags("Settings")
@Controller("settings")
export class SettingController {
	constructor(private readonly settingService: SettingService) {}

	@Public()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.settingService.findAll(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(@Body() body: CreateSettingDto) {
		return this.settingService.create(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateSettingDto,
	) {
		return this.settingService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.settingService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.settingService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.settingService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.settingService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.settingService.findById(id, { projection, populate });
	}
}
