import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Vote, VoteDocument } from "./schemas/vote.schema";

@Injectable()
export class VoteService extends BaseService<VoteDocument> {
  constructor(@InjectModel(Vote.name) model: Model<VoteDocument>) {
    super(model);
  }
}
