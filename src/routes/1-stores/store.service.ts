import { PaginateModel, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UserService } from "~routes/pre-built/1-users/user.service";

import {
	BadGatewayException,
	forwardRef,
	Inject,
	Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateStoreDto } from "./dto/create-store.dto";
import { Store, StoreDocument } from "./schemas/store.schema";

@Injectable()
export class StoreService extends BaseService<StoreDocument> {
	private storeModel: PaginateModel<StoreDocument>;

	constructor(
		@InjectModel(Store.name) model: PaginateModel<StoreDocument>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {
		super(model);

		this.storeModel = model;
	}
	async create(input: CreateStoreDto) {
		const foundUser = await this.userService.findById(
			new Types.ObjectId(input.userId),
		);

		if (!foundUser) throw new BadGatewayException("User not found");

		const storeCreated = await this.storeModel.create(input);

		this.userService.updateById(foundUser._id, {
			storeId: storeCreated._id.toString(),
		});

		return storeCreated;
	}
}
