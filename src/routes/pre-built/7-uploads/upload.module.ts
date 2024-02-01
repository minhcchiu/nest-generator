// import { FileModule } from '~common/c5-files/file.module';

import { LocalStorageModule } from "~shared/storage/local-storage/local-storage.module";

import { Module } from "@nestjs/common";

import { UserFileModule } from "../7-user-files/user-file.module";
import { UploadController } from "./upload.controller";
import { UploadHelper } from "./upload.helper";
import { UploadService } from "./upload.service";

@Module({
	imports: [LocalStorageModule, UserFileModule],
	controllers: [UploadController],
	providers: [UploadService, UploadHelper],
	exports: [],
})
export class UploadModule {}
