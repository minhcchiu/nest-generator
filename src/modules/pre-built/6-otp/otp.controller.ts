import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { CreateOtpDto } from "./dto/create-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { OtpService } from "./otp.service";

@Controller("otp")
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	//  ----- Method: GET -----
	@Get("/")
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.otpService.findMany(filter, options);
	}

	//  ----- Method: POST -----
	@Post("/send")
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateOtpDto) {
		return this.otpService.sendOtp(body);
	}

	@Post("/verify")
	@HttpCode(HttpStatus.OK)
	async verify(@Body() body: VerifyOtpDto) {
		return this.otpService.verifyOtp(body);
	}
}
