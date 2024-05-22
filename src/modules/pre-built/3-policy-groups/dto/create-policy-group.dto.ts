import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePolicyGroupDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsString()
	readonly description?: string;
}
