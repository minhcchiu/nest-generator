import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OtpSchema, Otp } from './schemas/otp.schema';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
