import { applyDecorators } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

export const ApiUploadFiles = (fields: string[]) => {
	const properties = {};

	fields.forEach((field) => {
		Object.assign(properties, {
			[field]: {
				type: "array",
				items: {
					type: "string",
					format: "binary",
				},
			},
		});
	});

	return applyDecorators(
		ApiBody({
			description: "File upload description",
			schema: {
				type: "object",
				properties,
			},
		}),
	);
};
