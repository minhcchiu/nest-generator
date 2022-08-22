import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import {
  SendOtpByPhoneDto,
  SendOtpByEmailDto,
  VerifyOtpEmailDto,
  VerifyOtpPhoneDto,
} from './dto';
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { collectionNames } from '~config/collections/collectionName';

@ApiTags('Otps')
@Controller(collectionNames.otp.path)
export class OtpController {
  constructor(private readonly otpService: OtpService) { }

  /**
   * Find all
   * @param query
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(@Query() query: any) {
    return this.otpService.find(query);
  }

  /**
   * Send otp to email
   * @param body
   * @returns
   */
  @Post('send-otp-email')
  @HttpCode(201)
  async sendOtpToEmail(@Body() body: SendOtpByEmailDto) {
    return this.otpService.sendOtpToEmail(body);
  }

  /**
   * Send otp by phone
   * @param body: SendOtpByPhoneDto
   * @returns
   */
  @Post('send-otp-phone')
  @HttpCode(201)
  async sendOtpToPhone(@Body() body: SendOtpByPhoneDto) {
    return this.otpService.sendOtpToPhone(body);
  }

  /**
   * veirfy otp email
   * @param body
   * @returns
   */
  @Put('verify-otp-email')
  @HttpCode(200)
  async verifyOtpEmail(@Body() body: VerifyOtpEmailDto) {
    return this.otpService.verifyOtpEmail(body);
  }

  /**
   * Verify Otp Phone
   * @param body: VerifyOtpPhoneDto
   * @returns: Boolean
   */
  @Put('verify-otp-phone')
  @HttpCode(200)
  async verifyOtpPhone(@Body() body: VerifyOtpPhoneDto) {
    return this.otpService.verifyOtpPhone(body);
  }

  /**
   * Delete
   * @param id
   * @returns
   */
  @Delete(':id')
  // @HttpCode(204)
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.otpService.deleteById(id);
  }

  /**
   * paginate
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto) {
    return this.otpService.paginate(query);
  }

  /**
   * findOneById
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  async findOneById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const result = await this.otpService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
