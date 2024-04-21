import { IsNotEmpty, IsString } from "class-validator";
export class SatisfiedOptionDto {
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsNotEmpty()
	@IsString()
	key: string;
	@IsNotEmpty()
	@IsString()
	thumbnail: string;
}
