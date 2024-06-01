import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";

export const GetCurrentUserId = createParamDecorator(
	(data: undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		return stringIdToObjectId(request.user._id);
	},
);
