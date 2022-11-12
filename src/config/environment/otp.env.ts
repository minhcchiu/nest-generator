import { defaultEnv } from './default.env';
import { registerAs } from '@nestjs/config';

const otpEnv = {
  maximunSecondSendOtp:
    +process.env.MAXIMUN_SECOND_SEND_OTP || defaultEnv.otp.maximunSecondSendOtp,
};

export type OtpConfig = typeof otpEnv;

export const otpConfig = registerAs('otp', () => otpEnv);
