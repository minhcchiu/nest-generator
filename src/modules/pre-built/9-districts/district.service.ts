import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { District, DistrictDocument } from "./schemas/district.schema";

@Injectable()
export class DistrictService extends BaseService<DistrictDocument> {
  constructor(@InjectModel(District.name) model: Model<DistrictDocument>) {
    super(model);
  }
}
