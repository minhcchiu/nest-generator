import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Inventory, InventoryDocument } from "./schemas/inventory.schema";

@Injectable()
export class InventoryService extends BaseService<InventoryDocument> {
	constructor(
		@InjectModel(Inventory.name) _model: PaginateModel<InventoryDocument>,
	) {
		super(_model);
	}
}
