import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Endpoint } from "./schemas/endpoint.schema";
@Injectable()
export class EndpointService extends BaseService<Endpoint> {
	constructor(@InjectModel(Endpoint.name) model: PaginateModel<Endpoint>) {
		super(model);
	}
}
