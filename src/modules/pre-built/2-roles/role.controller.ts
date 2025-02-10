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
import { Public } from "~common/decorators/public.decorator";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleService } from "./role.service";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/paginate")
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.roleService.paginate(filter, options);
  }

  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.roleService.findById(id, { projection, populate });
  }

  @Public()
  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.roleService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateRoleDto) {
    return this.roleService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.roleService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
