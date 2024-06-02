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
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { DistrictService } from "./district.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";

@Controller("districts")
export class DistrictController {
	constructor(private readonly districtService: DistrictService) {}
	//  ----- Method: GET -----
	@Public()
	@Get("/paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.districtService.paginate(filter, options);
	}

	@Public()
	@Get("/:id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.districtService.findById(id, { projection, populate });
	}

	@Public()
	@Get("/")
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.districtService.findMany(filter, options);
	}

	//  ----- Method: POST -----
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateDistrictDto) {
		return this.districtService.create(body);
	}

	//  ----- Method: PATCH -----
	@Patch("/:id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateDistrictDto,
	) {
		return this.districtService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@Delete("/:ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.districtService.deleteMany({
			_id: { $in: ids.split(",").map((id) => stringIdToObjectId(id)) },
		});
	}

	@Delete("/:id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.districtService.deleteById(id);
	}
}
