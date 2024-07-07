import { ResourceTypeEnum } from "../enum/resource-type.enum";

export type FileFormatted = {
	mimetype: string;
	buffer: Buffer;
	size: number;
	resourceType: ResourceTypeEnum;
	fileFolder: any;
	fileExt: string;
	fileName: string;
	originalname: string;
};
