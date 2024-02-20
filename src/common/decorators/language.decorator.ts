import { LanguageEnum } from "src/enums/language.enum";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetLanguage = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.headers["language"] || LanguageEnum.vi;
	},
);
