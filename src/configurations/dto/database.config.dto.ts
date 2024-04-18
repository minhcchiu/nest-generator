import { IsNotEmpty, IsString } from "class-validator";

export class DatabaseConfigDto {
	@IsNotEmpty()
	@IsString()
	DATABASE_NAME: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_URI: string;
}
