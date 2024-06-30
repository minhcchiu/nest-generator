export type ErrorDetail = {
	value?: string;
	property?: string;
	children?: ErrorDetail[];
	error?: string;
};
