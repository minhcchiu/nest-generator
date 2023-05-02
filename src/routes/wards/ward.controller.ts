import { ObjectId } from 'mongodb';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { WardService } from './ward.service';
import { Public } from '~decorators/public.decorator';

@ApiTags('Wards')
@Controller('wards')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Public()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.wardService.find(filter, options);
  }

  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateWardDto) {
    return this.wardService.create(body);
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateWardDto) {
    return this.wardService.updateById(id, body);
  }

  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.wardService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.wardService.deleteById(id);
  }

  @Public()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    return this.wardService.paginate(filter, options);
  }

  @Public()
  @Get('count')
  async count(@GetAqp('filter') filter: AqpDto) {
    return this.wardService.count(filter);
  }

  @Public()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: AqpDto,
  ) {
    return this.wardService.findById(id, { projection, populate });
  }
}
