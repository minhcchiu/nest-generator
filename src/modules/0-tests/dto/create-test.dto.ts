import { IsISO8601, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateTestDto {
	@IsMongoId()
	userString: string;

	@IsMongoId()
	userId: Types.ObjectId;

	@IsISO8601()
	dateBirth: string;
}
