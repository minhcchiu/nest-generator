import { UploadType } from "~types/upload-type";
import { StorageLocationEnum } from "../enum/store-location.enum";

export type UploadedResult = {
	files: string[];
	fileFolder: string;
	fileSize: number;
	resourceId: string;
	fileName: string;
	fileType: string;
	uploadType: UploadType;
	originalname: string;
	storageLocation: StorageLocationEnum;
	uploadedAt: string;
	isUploadedSuccess: boolean;
};
