import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { OtpService } from "./otp.service";
@Controller("otp")
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.otpService.findMany(filter, options);
	}
}
