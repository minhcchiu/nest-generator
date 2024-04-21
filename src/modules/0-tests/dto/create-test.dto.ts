import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateTestDto {
	@IsMongoId()
	userString: string;

	@IsMongoId()
	userId: Types.ObjectId;
}
