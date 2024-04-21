import { IsOptional, IsString } from "class-validator";
export class CreateSettingDto {
	@IsOptional()
	@IsString()
	logoUrl: string;
	@IsOptional()
	@IsString()
	serverName: string;
	@IsOptional()
	@IsString()
	termsOfUse: string;
	@IsOptional()
	@IsString()
	privacyPolicy: string;
}
