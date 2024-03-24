import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
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

import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { UserFileService } from "./user-file.service";

@ApiTags("User files")
@Controller("user_files")
export class UserFileController {
	constructor(private readonly userFileService: UserFileService) {}

	//  ----- Method: GET -----
	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.userFileService.paginate(filter, options);
	}

	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.userFileService.count(filter);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.userFileService.findById(id, { projection, populate });
	}

	//  ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":url/url")
	@HttpCode(HttpStatus.OK)
	async deleteByUrl(@Param("url") url: string) {
		return this.userFileService.deleteByUrl(url);
	}

	@ApiBearerAuth()
	@Delete(":urls/urls")
	@HttpCode(HttpStatus.OK)
	async deleteByUrls(@Param("urls") urls: string) {
		return this.userFileService.deleteByUrls(urls.split(","));
	}

	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.userFileService.deleteMany({
			_id: {
				$in: ids.split(",").map(stringIdToObjectId),
			},
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.userFileService.deleteById(id);
	}
}
