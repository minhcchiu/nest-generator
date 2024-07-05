export type ErrorDetail = {
	property: string;
	message: string;
	errors?: ErrorDetail[];
	details?: string[];
};
