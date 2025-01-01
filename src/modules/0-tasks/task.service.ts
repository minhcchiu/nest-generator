import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Task, TaskDocument } from "./schemas/task.schema";

@Injectable()
export class TaskService extends BaseService<TaskDocument> {
  constructor(@InjectModel(Task.name) model: Model<TaskDocument>) {
    super(model);
  }
}
