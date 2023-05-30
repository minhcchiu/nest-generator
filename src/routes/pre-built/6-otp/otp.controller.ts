import { GetAqp } from '~decorators/get-aqp.decorator';
import { Public } from '~decorators/public.decorator';
import { AqpDto } from '~dto/aqp.dto';

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.otpService.find(filter, options);
  }
}
