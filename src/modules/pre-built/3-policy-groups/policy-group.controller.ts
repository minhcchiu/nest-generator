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
import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { UserGroupService } from "../2-user-groups/user-group.service";
import { CreatePolicyGroupDto } from "./dto/create-policy-group.dto";
import { UpdatePolicyGroupDto } from "./dto/update-policy-group.dto";
import { PolicyGroupService } from "./policy-group.service";

@Controller("policy_groups")
export class PolicyGroupController {
  constructor(
    private readonly policyGroupService: PolicyGroupService,
    private readonly userGroupService: UserGroupService,
  ) {}

  //  ----- Method: GET -----
  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.policyGroupService.findMany(filter, options);
  }

  @Get("/paginate")
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.policyGroupService.paginate(filter, options);
  }

  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.policyGroupService.findById(id, { projection, populate });
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUserId() userId: ObjectId, @Body() body: CreatePolicyGroupDto) {
    Object.assign(body, { createdBy: userId });

    return this.policyGroupService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdatePolicyGroupDto) {
    return this.policyGroupService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.policyGroupService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
