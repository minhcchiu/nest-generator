import { UploadType } from "~types/upload-type";
import { StorageLocationEnum } from "../enum/store-location.enum";

export type UploadedResult = {
	url: string;
	urlXSmall?: string;
	urlSmall?: string;
	urlMedium?: string;
	urlLarge?: string;
	urlXLarge?: string;

	fileFolder: string;
	fileSize: number;
	resourceIds: string[];
	fileName: string;
	fileType: string;
	uploadType: UploadType;
	originalname: string;
	storageLocation: StorageLocationEnum;
	uploadedAt: string;
	isUploadedSuccess: boolean;
};
