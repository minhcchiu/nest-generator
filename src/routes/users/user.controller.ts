import { ObjectId } from 'mongodb';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { GetCurrentUserId } from '~decorators/get-current-user-id.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Public } from '~decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.userService.find(filter, options);
  }

  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateUserDto) {
    await this.userService.validateCreateUser({ phone: body.phone, email: body.email });

    return this.userService.updateById(id, body);
  }

  @Patch('password')
  async updatePassword(@GetCurrentUserId() id: ObjectId, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePasswordById(id, body);
  }

  @Delete(':ids/soft_ids')
  async deleteManySoftByIds(@Param('ids') ids: string) {
    return this.userService.updateMany({ _id: { $in: ids.split(',') } }, { deleted: true });
  }

  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.userService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.userService.deleteById(id);
  }

  @Get('me')
  async getMe(@GetCurrentUserId() id: ObjectId) {
    return this.userService.findById(id);
  }

  @Public()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    return this.userService.paginate(filter, options);
  }

  @Public()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: AqpDto,
  ) {
    return this.userService.findById(id, { projection, populate });
  }
}
