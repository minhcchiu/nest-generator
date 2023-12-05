import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { LanguageEnum } from "src/enums/language.enum";

export const Language = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.headers["language"] || LanguageEnum.vi;
	},
);
