import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString, Length } from "class-validator";
import { CreateOtpDto } from "./create-otp.dto";

export class VerifyOtpDto extends PartialType(CreateOtpDto) {
  @IsNotEmpty()
  @Length(4)
  @IsNumberString()
  otpCode: string;
}
