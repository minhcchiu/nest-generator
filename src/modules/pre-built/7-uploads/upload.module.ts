// import { FileModule } from '~common/c5-files/file.module';
import { Module } from "@nestjs/common";
import { UserFileModule } from "../7-user-files/user-file.module";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
	imports: [UserFileModule],
	controllers: [UploadController],
	providers: [UploadService],
	exports: [],
})
export class UploadModule {}
