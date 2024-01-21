import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { AqpDto } from "~dto/aqp.dto";

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { OtpService } from "./otp.service";

@ApiTags("otp")
@Controller("otp")
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Get()
	async findAll(@GetAqp() { filter, ...options }: AqpDto) {
		return this.otpService.findAll(filter, options);
	}
}
