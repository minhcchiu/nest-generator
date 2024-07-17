import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { LanguageCodeEnum } from "~enums/language.enum";

export const GetLanguage = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers["language"] || LanguageCodeEnum.Vi;
});
