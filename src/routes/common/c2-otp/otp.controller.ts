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
import { schemas } from '~config/collections/schemas.collection';

@ApiTags(schemas.otp.path)
@Controller(schemas.otp.path)
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /**
   * Find all
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async findAll(@Query() query: any) {
    return this.otpService.find(query);
  }

  /**
   * Send otp to email
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send-otp-signup')
  async sendOptSignup(@Body() { email, phone }: any) {
    return this.otpService.sendOtpSignup({ email, phone });
  }

  /**
   * Send otp to email
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send-otp-to-email')
  async sendOtpToEmail(@Body() body: SendOtpByEmailDto) {
    return this.otpService.sendOtpToEmail(body);
  }

  /**
   * Send otp by phone
   * @param body: SendOtpByPhoneDto
   * @returns
   */
  @HttpCode(201)
  @Post('send-otp-to-phone')
  async sendOtpToPhone(@Body() body: SendOtpByPhoneDto) {
    return this.otpService.sendOtpToPhone(body);
  }

  /**
   * veirfy otp email
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put('verify-otp-email')
  async verifyOtpEmail(@Body() body: VerifyOtpEmailDto) {
    return this.otpService.verifyOtpEmail(body);
  }

  /**
   * Verify Otp Phone
   * @param body: VerifyOtpPhoneDto
   * @returns: Boolean
   */
  @HttpCode(200)
  @Put('verify-otp-phone')
  async verifyOtpPhone(@Body() body: VerifyOtpPhoneDto) {
    return this.otpService.verifyOtpPhone(body);
  }

  /**
   * Delete many by ids
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.otpService.deleteMany({ _id: { $in: ids.split(',') } });
  }

  /**
   * Delete
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.otpService.deleteById(id);
  }
  /**
   * paginate
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@ApiQueryParams() query: ApiQueryParamsDto) {
    return this.otpService.paginate(query);
  }

  /**
   * findOneById
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const result = await this.otpService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}
