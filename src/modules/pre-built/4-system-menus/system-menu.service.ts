import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { SystemMenu } from "./schemas/system-menu.schema";

@Injectable()
export class SystemMenuService extends BaseService<SystemMenu> {
  constructor(@InjectModel(SystemMenu.name) model: Model<SystemMenu>) {
    super(model);
  }
}
