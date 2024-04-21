import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
} from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { UserFileService } from "./user-file.service";
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

	@Delete(":url/url")
	@HttpCode(HttpStatus.OK)
	async deleteByUrl(@Param("url") url: string) {
		return this.userFileService.deleteByUrl(url);
	}

	@Delete(":urls/urls")
	@HttpCode(HttpStatus.OK)
	async deleteByUrls(@Param("urls") urls: string) {
		return this.userFileService.deleteByUrls(urls.split(","));
	}

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.userFileService.deleteMany({
			_id: {
				$in: ids.split(",").map(stringIdToObjectId),
			},
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.userFileService.deleteById(id);
	}
}
