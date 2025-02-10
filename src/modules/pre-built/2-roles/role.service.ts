import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ROLES_DEFAULT } from "~utils/constant";
import { Role } from "./schemas/role.schema";

@Injectable()
export class RoleService extends BaseService<Role> {
  private roleService = this;

  constructor(@InjectModel(Role.name) model: Model<Role>) {
    super(model);
  }

  async getRoleSupperAdmin() {
    return this.roleService.findOne({ key: ROLES_DEFAULT.SupperAdmin });
  }

  async getRoleUser() {
    return this.roleService.findOne({ key: ROLES_DEFAULT.User });
  }
}
