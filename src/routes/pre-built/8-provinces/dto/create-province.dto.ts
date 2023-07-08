import { IsNotEmpty, IsString } from "class-validator";

export class CreateProvinceDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsString()
	readonly type: string;
}
