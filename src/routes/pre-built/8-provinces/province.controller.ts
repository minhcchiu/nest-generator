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

import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { ProvinceService } from "./province.service";

@ApiTags("Provinces")
@Controller("provinces")
export class ProvinceController {
	constructor(private readonly provinceService: ProvinceService) {}

	@Public()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.provinceService.findAll(filter, options);
	}

	@HttpCode(201)
	@Post()
	async create(@Body() body: CreateProvinceDto) {
		return this.provinceService.create(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: string,
		@Body() body: UpdateProvinceDto,
	) {
		return this.provinceService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.provinceService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: string) {
		return this.provinceService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.provinceService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.provinceService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: string,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.provinceService.findById(id, { projection, populate });
	}
}
