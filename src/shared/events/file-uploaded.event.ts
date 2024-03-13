import { CreateUserFileDto } from "~pre-built/7-user-files/dto/create-user-file.dto";

export class FileUploadedEvent {
	constructor(public readonly file: CreateUserFileDto) {}
}
