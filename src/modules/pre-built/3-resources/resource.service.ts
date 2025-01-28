import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Resource } from "./schemas/resource.schema";

@Injectable()
export class ResourceService extends BaseService<Resource> {
  constructor(@InjectModel(Resource.name) model: Model<Resource>) {
    super(model);
  }
}
