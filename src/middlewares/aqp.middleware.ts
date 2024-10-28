import aqp from "api-query-params";
import { NextFunction, Request, Response } from "express";

import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";

import { PopulateOptions } from "mongoose";
import { convertOneOfToOr } from "~utils/convert-oneOf-to-or";
import { PaginationDto } from "../common/dto/pagination.dto";
import { aqpValidatorDto } from "./validator/aqp.validator";

// BLACK LIST
const blacklist = ["idToken", "password"];

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
      await aqpValidatorDto(PaginationDto, { ...query, populate, page });
    } catch (e) {
      next(new BadRequestException(e.message));
    }

    const queryParams: typeof query & { populate?: PopulateOptions[]; page?: number } = query;

    if (populate) queryParams.populate = populate;
    if (page) queryParams.page = page;

    // Convert $oneOf to $or
    convertOneOfToOr(queryParams.filter || {});

    // Assign to request
    req["aqp"] = queryParams;

    next();
  }
}
