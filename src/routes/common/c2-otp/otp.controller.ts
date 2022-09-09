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
  SendOtpToPhoneDto,
  SendOtpToEmailDto,
  VerifyOtpEmailDto,
  VerifyOtpPhoneDto,
} from './dto';
import { ParseObjectIdPipe } from 'src/utils/pipe/parse-object-id.pipe';
import { ApiQueryParams } from '~decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/utils/interceptor/api-query-params.dto';
import { schemas } from '~config/collections/schemas.collection';
import { UserService } from '~common/c1-users/user.service';

@ApiTags(schemas.otp.path)
@Controller(schemas.otp.path)
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly userService: UserService,
  ) {}

  /**
   * Send otp to phone
   * @param body: SendOtpToPhoneDto
   * @returns
   */
  @HttpCode(201)
  @Post('send_otp')
  async sendOtpToPhone(@Body() body: SendOtpToPhoneDto) {
    return this.otpService.sendOtpToPhone(body);
  }

  /**
   * Send otp to email
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send_otp_to_email')
  async sendOtpToEmail(@Body() body: SendOtpToEmailDto) {
    return this.otpService.sendOtpToEmail(body);
  }

  /**
   * Send otp signup to phone
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send_otp_signup')
  async sendOtpSignupToPhone(@Body() body: SendOtpToPhoneDto) {
    await this.userService.validateCreateUser({ phone: body.phone });

    return this.otpService.sendOtpToPhone(body);
  }

  /**
   * Send otp signup to email
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('send_otp_signup_to_email')
  async sendOtpSignupSignup(@Body() body: SendOtpToEmailDto) {
    await this.userService.validateCreateUser({ email: body.email });

    return this.otpService.sendOtpToEmail(body);
  }

  /**
   * Verify Otp Phone
   * @param body: VerifyOtpPhoneDto
   * @returns: Boolean
   */
  @HttpCode(200)
  @Put('verify_otp')
  async verifyOtpPhone(@Body() body: VerifyOtpPhoneDto) {
    return this.otpService.verifyOtpPhone(body);
  }

  /**
   * veirfy otp email
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put('verify_otp_email')
  async verifyOtpEmail(@Body() body: VerifyOtpEmailDto) {
    return this.otpService.verifyOtpEmail(body);
  }

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
   * Count
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('count')
  async count(@Query() query: any) {
    return this.otpService.count(query);
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
