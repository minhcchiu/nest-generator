import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Policy } from "./schemas/policy.schema";

@Injectable()
export class PolicyService extends BaseService<Policy> {
  constructor(@InjectModel(Policy.name) model: Model<Policy>) {
    super(model);
  }
}
