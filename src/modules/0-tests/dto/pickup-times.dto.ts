import { IsISO8601 } from "class-validator";

export class PickTimesDto {
	@IsISO8601()
	receiptAt: Date;

	@IsISO8601()
	returnAt: Date;
}
