import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiParamOptions } from '@nestjs/swagger';

export const ApiParamId = (
  options: ApiParamOptions = {
    name: 'id',
    type: String,
    required: true,
  },
) => {
  return applyDecorators(ApiParam(options));
};
