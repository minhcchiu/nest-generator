import { UploadType } from "~types/upload-type";
import { StorageLocationEnum } from "../enum/store-location.enum";

export type UploadedResult = {
	fileOriginal?: string;
	fileLg?: string;
	fileMd?: string;
	fileSm?: string;
	fileXs?: string;
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
