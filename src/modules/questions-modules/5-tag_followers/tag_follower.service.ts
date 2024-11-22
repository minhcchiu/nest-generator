import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TagFollower, TagFollowerDocument } from "./schemas/tag_follower.schema";

@Injectable()
export class TagFollowerService extends BaseService<TagFollowerDocument> {
  constructor(@InjectModel(TagFollower.name) model: Model<TagFollowerDocument>) {
    super(model);
  }
}
