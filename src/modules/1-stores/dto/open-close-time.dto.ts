import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Max,
	Min,
} from "class-validator";
import { NullableType } from "~types/nullable.type";

export class OpenCloseTimeDto {
	@IsNotEmpty()
	@Min(0)
	@Max(6)
	dayOfWeek: number;

	@IsNotEmpty()
	@IsString()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: "Time should be in the format hh:mm",
	})
	openTime: string;

	@IsNotEmpty()
	@IsString()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: "Time should be in the format hh:mm",
	})
	closeTime: string;

	@IsOptional()
	@IsString()
	note: NullableType<string>;

	@IsOptional()
	@IsBoolean()
	isOff: NullableType<boolean>;
}
