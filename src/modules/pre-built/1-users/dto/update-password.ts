import { IsNotEmpty, Length } from "class-validator";
export class UpdatePasswordDto {
	@IsNotEmpty()
	@Length(6, 50)
	oldPassword: string;
	@IsNotEmpty()
	@Length(6, 50)
	newPassword: string;
}
