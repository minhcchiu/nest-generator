import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateUserFileDto } from "./dto/create-user-file.dto";
import { UserFile, UserFileDocument } from "./schemas/user-file.schema";

@Injectable()
export class UserFileService extends BaseService<UserFileDocument> {
	@InjectModel(UserFile.name) userFileModel: PaginateModel<UserFileDocument>;
	constructor(
		@InjectModel(UserFile.name) model: PaginateModel<UserFileDocument>,
	) {
		super(model);

		this.userFileModel = model;
	}

	async createMany(inputs: CreateUserFileDto[]) {
		return this.userFileModel.create(inputs);
	}
}
