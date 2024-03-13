import { FileType } from "~types/file.type";
import { StorageLocationEnum } from "../enum/store-location.enum";

export type UploadedResult = {
	url: string;
	fileFolder: string;
	fileSize: number;
	resourceId: string;

	fileName: string;
	fileType: FileType;
	storageLocation: StorageLocationEnum;
	originalname: string;
	uploadedAt: number;
	error?: undefined;
};
