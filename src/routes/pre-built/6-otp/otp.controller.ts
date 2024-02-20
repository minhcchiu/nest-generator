import { GetAqp } from "~decorators/get-aqp.decorator";
import { AqpDto } from "~dto/aqp.dto";

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { OtpService } from "./otp.service";

@ApiTags("OTP")
@Controller("otp")
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@ApiBearerAuth()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: AqpDto) {
		return this.otpService.findMany(filter, options);
	}
}
