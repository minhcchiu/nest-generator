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

import { DistrictService } from "./district.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";

@ApiTags("Districts")
@Controller("districts")
export class DistrictController {
	constructor(private readonly districtService: DistrictService) {}

	@Public()
	@Get("")
	async find(@GetAqp() { filter, ...options }: AqpDto) {
		return this.districtService.find(filter, options);
	}

	@HttpCode(201)
	@Post("")
	async create(@Body() body: CreateDistrictDto) {
		return this.districtService.create(body);
	}

	@Patch(":id")
	async update(
		@Param("id", ParseObjectIdPipe) id: string,
		@Body() body: UpdateDistrictDto,
	) {
		return this.districtService.updateById(id, body);
	}

	@Delete(":ids/ids")
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.districtService.deleteMany({
			_id: { $in: ids.split(",") },
		});
	}

	@Delete(":id")
	async delete(@Param("id", ParseObjectIdPipe) id: string) {
		return this.districtService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.districtService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.districtService.count(filter);
	}

	@Public()
	@Get(":id")
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: string,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.districtService.findById(id, { projection, populate });
	}
}
