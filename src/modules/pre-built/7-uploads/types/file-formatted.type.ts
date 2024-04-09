import { UploadType } from "~types/upload-type";

export type FileFormatted = {
	mimetype: string;
	buffer: Buffer;
	size: number;
	uploadType: UploadType;
	fileFolder: any;
	fileExt: string;
	fileName: string;
	originalname: string;
};
