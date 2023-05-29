import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryParams = () => {
  return applyDecorators(
    ApiQuery({
      name: '_limit',
      type: Number,
      required: false,
    }),
    ApiQuery({
      name: '_page',
      type: Number,
      required: false,
    }),
    ApiQuery({
      name: '_populate',
      type: String,
      required: false,
    }),
    ApiQuery({
      name: '_fields',
      type: String,
      required: false,
    }),
    ApiQuery({
      name: '_sort',
      type: String,
      required: false,
    }),
  );
};
