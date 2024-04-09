import { UploadType } from "~types/upload-type";

export interface FileOption {
	maxSize: number;
	allowedExtensions: string[];
}

export interface UploadConfig {
	image: FileOption;
	video: FileOption;
	audio: FileOption;
	auto: FileOption;
	raw: FileOption;
	storageFolders: Record<UploadType, string>;
}
