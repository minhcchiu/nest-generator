import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { AqpDto } from "~dto/aqp.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { TokenService } from "./token.service";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

@ApiTags("Tokens")
@Controller("tokens")
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: AqpDto) {
		return this.tokenService.findMany(filter, options);
	}

	@ApiBearerAuth()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: AqpDto) {
		return this.tokenService.paginate(filter, options);
	}

	@ApiBearerAuth()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: AqpDto) {
		return this.tokenService.count(filter);
	}

	@ApiBearerAuth()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: AqpDto,
	) {
		return this.tokenService.findById(id, { projection, populate });
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.tokenService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.tokenService.deleteById(id);
	}
}
