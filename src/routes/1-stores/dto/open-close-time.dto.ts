import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Max,
	Min,
} from "class-validator";
import { NullableType } from "~utils/types/nullable.type";

import { ApiProperty } from "@nestjs/swagger";

export class OpenCloseTimeDto {
	@ApiProperty({ example: 0, description: "Day of the week (0-6)" })
	@IsNotEmpty()
	@Min(0)
	@Max(6)
	dayOfWeek: number;

	@ApiProperty({
		example: "08:00",
		description: "Opening time in HH:mm format",
	})
	@IsNotEmpty()
	@IsString()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: "Time should be in the format hh:mm",
	})
	openTime: string;

	@ApiProperty({
		example: "18:00",
		description: "Closing time in HH:mm format",
	})
	@IsNotEmpty()
	@IsString()
	@Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
		message: "Time should be in the format hh:mm",
	})
	closeTime: string;

	@ApiProperty({
		example: "",
		description: "Additional notes for the schedule",
	})
	@IsOptional()
	@IsString()
	note: NullableType<string>;

	@ApiProperty({
		example: false,
		description: "Flag indicating if the location is closed on this day",
	})
	@IsOptional()
	@IsBoolean()
	isOff: NullableType<boolean>;
}
