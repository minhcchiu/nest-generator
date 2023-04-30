import { ApiParam, ApiTags } from '@nestjs/swagger';
import { EndpointService } from './endpoint.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { AqpDto } from '~dto/aqp.dto';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { ApiQueryParams } from '~decorators/aqp.swagger';
import { ApiParamId } from '~decorators/api-param-id.swagger';

@ApiTags('Endpoints')
@Controller('endpoints')
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @ApiQueryParams()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    const { page = 1, ...opts } = options;
    opts.skip = (page - 1) * opts.limit;

    return this.endpointService.find(filter, opts);
  }

  @ApiQueryParams()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    console.log({ filter, ...options });
    return this.endpointService.paginate(filter, options);
  }

  @Get('count')
  async count(@GetAqp('filter') filter: AqpDto) {
    return this.endpointService.count(filter);
  }

  @ApiParamId()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @GetAqp() { projection, populate }: AqpDto,
  ) {
    return this.endpointService.findById(id, { projection, populate });
  }

  @HttpCode(201)
  @Post('')
  async create(@Body() body: CreateEndpointDto) {
    return this.endpointService.create(body);
  }

  @ApiParamId()
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateEndpointDto,
  ) {
    return this.endpointService.updateById(id, body);
  }

  @ApiParam({
    name: 'ids',
    required: true,
    type: 'ObjectId',
  })
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.endpointService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @ApiParamId()
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.endpointService.deleteById(id);
  }
}
