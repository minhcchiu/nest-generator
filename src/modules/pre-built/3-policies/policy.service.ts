import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FlattenMaps, Model, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Resource } from "~modules/pre-built/3-resources/schemas/resource.schema";
import { arrayToMap } from "~utils/common.util";
import { Policy } from "./schemas/policy.schema";

@Injectable()
export class PolicyService extends BaseService<Policy> {
  private policyService = this;
  constructor(@InjectModel(Policy.name) model: Model<Policy>) {
    super(model);
  }

  async assignPoliciesToResources(
    resources: (FlattenMaps<Resource> & {
      _id: Types.ObjectId;
    })[],
  ) {
    const policesFound = await this.policyService.findMany({
      resourceId: { $in: resources.map(r => r._id) },
    });

    const policiesMap = arrayToMap(policesFound, p => p.resourceId.toString());

    return resources.map(item => {
      Object.assign(item, {
        policies: policiesMap.get(item._id.toString()),
      });

      return item;
    });
  }
}
