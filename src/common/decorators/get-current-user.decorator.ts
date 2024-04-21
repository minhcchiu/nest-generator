import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayload } from "~modules/pre-built/5-tokens/interface";

export const GetCurrentUser = createParamDecorator(
	(data: keyof TokenPayload, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		if (data) return request.user[data];

		return request.user;
	},
);
