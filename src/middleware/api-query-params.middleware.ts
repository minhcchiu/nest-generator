import * as aqp from 'api-query-params';
import { ApiQueryParamsDto } from './dto/api-query-params.dto';
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { queryParamValidatorDto } from './validator/api-query-params.validator';

// BLACK LIST
const blacklist = ['apiKey'];

@Injectable()
export class ApiQueryParamsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // Remove key query projection by key: "fields" in API-Query-Params
    if (req.query.fields && (req.query.fields as string).includes('password')) {
      throw new BadRequestException('Fields cannot access passwords');
    }

    // Convert req.query to api-query-params
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const query: any = aqp(req.query, { skipKey: 'page', blacklist });

    // Validate params
    try {
      await queryParamValidatorDto(ApiQueryParamsDto, query);
    } catch (e) {
      next(e);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.aqp = query;
    next();
  }
}
