import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { EventEmitterService } from "~shared/event-emitters/event-emitter.service";
import { UserFileService } from "./user-file.service";

@Controller("user_files")
export class UserFileController {
  constructor(
    private readonly userFileService: UserFileService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  @HttpCode(HttpStatus.OK)
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userFileService.paginate(filter, options);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.userFileService.findById(id, { projection, populate });
  }

  //  ----- Method: DELETE -----
  @Delete("filename/:filename")
  @HttpCode(HttpStatus.OK)
  async deleteByFileName(@Param("filename") fileName: string) {
    const file = await this.userFileService.findOne({
      fileName,
    });

    if (!file) throw new NotFoundException("File not found.");

    this.eventEmitterService.emitDeleteFiles([file]);

    return file;
  }

  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyByIds(@Param("ids") ids: string) {
    const files = await this.userFileService.findMany({
      _id: {
        $in: ids.split(",").map(id => stringIdToObjectId(id)),
      },
    });

    if (!files?.length) throw new NotFoundException("Files not found.");

    this.eventEmitterService.emitDeleteFiles(files);

    return this.userFileService.deleteMany({ _id: { $in: ids.split(",") } });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    const file = await this.userFileService.deleteById(id);

    if (!file) throw new NotFoundException("File not found.");

    this.eventEmitterService.emitDeleteFiles([file]);

    return file;
  }
}
