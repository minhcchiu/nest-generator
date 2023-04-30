import { ObjectId } from 'mongodb';
import { dbCollections } from '~config/collections/schemas.collection';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@ApiTags(dbCollections.otp.path)
@Controller(dbCollections.otp.path)
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /**
   * Find all docs
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async find(@GetAqp() queryParams: AqpDto) {
    return this.otpService.find(queryParams);
  }

  /**
   * paginate
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@GetAqp() queryParams: AqpDto) {
    return this.otpService.paginate(queryParams);
  }

  /**
   * Find by id
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const result = await this.otpService.findById(id);

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }

  /**
   * Send otp to phone
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send')
  async sendOtp(@Body() body: SendOtpDto) {
    return this.otpService.sendOtp(body);
  }

  /**
   * Send otp signup to emai/phone
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send_signup')
  async sendOtpSignup(@Body() body: SendOtpDto) {
    return this.otpService.sendOtpSignup(body);
  }

  /**
   * Verify Otp by phone/email
   *
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put('verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOtp(body);
  }

  /**
   * Delete many by ids
   *
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.otpService.deleteMany({ _id: { $in: ids.split(',') } });
  }

  /**
   * Delete by id
   *
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.otpService.deleteById(id);
  }
}
