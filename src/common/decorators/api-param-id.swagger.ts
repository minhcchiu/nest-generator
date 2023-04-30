import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export const ApiParamId = (
  options: ApiQueryOptions = {
    name: 'id',
    type: 'ObjectId',
    required: true,
  },
) => {
  return applyDecorators(ApiQuery(options));
};
