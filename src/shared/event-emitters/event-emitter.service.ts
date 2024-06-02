import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Types } from "mongoose";
import { StorageLocationEnum } from "~modules/pre-built/7-uploads/enum/store-location.enum";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
import { UploadType } from "~types/upload-type";

@Injectable()
export class EventEmitterService {
	constructor(private eventEmitter: EventEmitter2) {}

	emitFileUploaded(files: UploadedResult[], userId: Types.ObjectId) {
		return this.eventEmitter.emit("file.uploaded", files, userId);
	}

	emitDeleteFiles(
		inputs: {
			storageLocation: StorageLocationEnum;
			resourceKeys: string[];
			resourceType: UploadType;
		}[],
	) {
		return this.eventEmitter.emit("file.delete.files", inputs);
	}

	emitDeleteFileByUrl(url: string) {
		return this.eventEmitter.emit("file.delete.url", url);
	}

	emitDeleteFileByUrls(urls: string[]) {
		return this.eventEmitter.emit("file.delete.urls", urls);
	}
}
