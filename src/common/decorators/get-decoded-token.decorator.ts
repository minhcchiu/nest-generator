import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { DecodedToken } from "~modules/pre-built/5-tokens/interface";

export const GetDecodedToken = createParamDecorator(
  (data: keyof DecodedToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  },
);
