import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryParams = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (data) return request.aqp[data];

    return request.aqp;
  },
);
