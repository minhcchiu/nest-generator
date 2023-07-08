import aqp from "api-query-params";
import { NextFunction, Request, Response } from "express";

import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";

import { AqpDto } from "../common/dto/aqp.dto";
import { aqpValidatorDto } from "./validator/aqp.validator";

// BLACK LIST
const blacklist = ["apiKey"];

@Injectable()
export class AqpMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: NextFunction) {
		const {
			population: populate,
			skip: page,
			...query
		} = aqp(req.query, {
			skipKey: "_page",
			limitKey: "_limit",
			populationKey: "_populate",
			sortKey: "_sort",
			projectionKey: "_fields",
			blacklist,
		});

		// Validate params
		try {
			await aqpValidatorDto(AqpDto, { ...query, populate, page });
		} catch (e) {
			next(new BadRequestException(e.message));
		}

		const queryParams: typeof query & {
			populate?: any;
			page?: any;
		} = query;

		if (populate) queryParams.populate = populate;
		if (page) queryParams.page = page;

		req["aqp"] = queryParams;
		next();
	}
}
