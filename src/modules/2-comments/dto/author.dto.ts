import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class AuthorDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;
	@IsOptional()
	@IsString()
	readonly avatar: string;
	@IsNotEmpty()
	@IsString()
	readonly fullName: string;
}
