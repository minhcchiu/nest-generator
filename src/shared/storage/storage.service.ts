import { Injectable } from "@nestjs/common";
import { FileFormatted } from "~modules/pre-built/7-uploads/types/file-formatted.type";
import { UploadedError } from "~modules/pre-built/7-uploads/types/upload.error.type";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { ImageSize } from "./local-storage/local.service";
@Injectable()
export abstract class StorageService {
	abstract saveFile(
		file: FileFormatted,
		imageSizes?: ImageSize[],
	): Promise<UploadedResult | UploadedError>;

	abstract deleteByKey(resourceKey: string): Promise<{
		deletedAt: number;
		message: string;
	}>;

	abstract deleteManyByKeys(resourceKeys: string[]): Promise<
		{
			deletedAt: number;
			message: string;
		}[]
	>;
}
