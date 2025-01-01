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
import { ObjectId } from "mongodb";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateUserGroupDto } from "./dto/create-user-group.dto";
import { UpdateUserGroupDto } from "./dto/update-user-group.dto";
import { UserGroupService } from "./user-group.service";

@Controller("user_groups")
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  //  ----- Method: GET -----
  @Get("/paginate")
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userGroupService.paginate(filter, options);
  }

  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.userGroupService.findById(id, { projection, populate });
  }

  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.userGroupService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserGroupDto) {
    return this.userGroupService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateUserGroupDto) {
    return this.userGroupService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.userGroupService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param("id", ParseObjectIdPipe) id: ObjectId) {
    return this.userGroupService.deleteById(id);
  }
}
