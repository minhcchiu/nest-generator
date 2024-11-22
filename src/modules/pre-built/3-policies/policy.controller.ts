import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { CreatePolicyDto } from "./dto/create-policy.dto";
import { UpdatePolicyDto } from "./dto/update-policy.dto";
import { PolicyService } from "./policy.service";

@Controller("policies")
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  //  ----- Method: GET -----
  @Public()
  @Get("/groups")
  async getPolicyWithGroup(@GetAqp() { filter }: PaginationDto) {
    const groups = await this.policyService.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$policyGroupId",
          policies: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "policy-groups",
          localField: "_id",
          foreignField: "_id",
          as: "policyGroup",
        },
      },
      { $unwind: "$policyGroup" },
      { $sort: { "policyGroup.name": 1 } },
      { $project: { "policyGroup.collectionName": 0 } },
    ]);

    return groups;
  }

  @Public()
  @Get("/paginate")
  async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.policyService.paginate(filter, options);
  }

  @Get("/:id")
  async findById(
    @Param("id", ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: PaginationDto,
  ) {
    return this.policyService.findById(id, { projection, populate });
  }

  @Get("/")
  async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
    return this.policyService.findMany(filter, options);
  }

  //  ----- Method: POST -----
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePolicyDto) {
    body.policyKey = `${body.method}:${body.endpoint}`;

    return this.policyService.create(body);
  }

  //  ----- Method: PATCH -----
  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async update(@Param("id", ParseObjectIdPipe) id: ObjectId, @Body() body: UpdatePolicyDto) {
    const found = await this.policyService.findById(id);

    if (!found) throw new NotFoundException("Policy not found!");

    if (body.method || body.endpoint) {
      const method = body.method || found.method;
      const endpoint = body.endpoint || found.endpoint;

      body.policyKey = `${method}:${endpoint}`;
    }

    return this.policyService.updateById(id, body);
  }

  //  ----- Method: DELETE -----
  @Delete("/:ids/bulk")
  @HttpCode(HttpStatus.OK)
  async deleteManyByIds(@Param("ids") ids: string) {
    return this.policyService.deleteMany({
      _id: { $in: ids.split(",").map(id => stringIdToObjectId(id)) },
    });
  }
}
