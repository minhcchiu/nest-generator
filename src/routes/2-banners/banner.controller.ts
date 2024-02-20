import { Types } from "mongoose";
import { ApiQueryParams } from "src/common/swaggers/api-query-params.swagger";
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
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { BannerService } from "./banner.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { AppTypeEnum } from "./enums/app-type.enum";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

@ApiTags("Banners")
@Controller("banners")
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	// ----- Method: GET -----
	@ApiQueryParams([
		{ name: "startAt", type: Number },
		{ name: "endAt", type: Number },
		{ name: "isActive", type: Boolean, required: false },
		{ name: "appType", enum: AppTypeEnum },
	])
	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: AqpDto) {
		return this.bannerService.findMany(filter, options);
	}

	@ApiQueryParams([
		{ name: "startAt", type: Number },
		{ name: "endAt", type: Number },
		{ name: "isActive", type: Boolean, required: false },
		{ name: "appType", enum: AppTypeEnum },
	])
	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.bannerService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.bannerService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.bannerService.findById(id, { projection, populate });
	}

	// ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateBannerDto) {
		return this.bannerService.create(body);
	}

	// ----- Method: PATCH -----
	@ApiBearerAuth()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateBannerDto,
	) {
		return this.bannerService.updateById(id, body);
	}

	// ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.bannerService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.bannerService.deleteById(id);
	}
}
