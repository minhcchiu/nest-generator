import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { PolicyGroup } from "./schemas/policy-group.schema";

@Injectable()
export class PolicyGroupService extends BaseService<PolicyGroup> {
  constructor(@InjectModel(PolicyGroup.name) model: Model<PolicyGroup>) {
    super(model);
  }
}
