import { ApiParamId } from '~decorators/api-param-id.swagger';
import { ApiQueryParams } from '~decorators/aqp.swagger';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~utils/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { UpdateEndpointDto } from './dto/update-endpoint.dto';
import { EndpointService } from './endpoint.service';
import { EndpointGroupService } from '../2-endpoint-groups/endpoint-group.service';

@ApiTags('Endpoints')
@Controller('endpoints')
export class EndpointController {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly endpointGroupService: EndpointGroupService,
  ) {}

  @ApiQueryParams()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.endpointService.find(filter, options);
  }

  @ApiQueryParams()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    return this.endpointService.paginate(filter, options);
  }

  @Get('count')
  async count(@GetAqp('filter') filter: AqpDto) {
    return this.endpointService.count(filter);
  }

  @ApiParamId()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: string,
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
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() body: UpdateEndpointDto) {
    return this.endpointService.updateById(id, body);
  }

  @ApiParamId()
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.endpointService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @ApiParamId()
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const [deleted] = await Promise.all([
      this.endpointService.deleteById(id),
      this.endpointGroupService.updateOne({ endpoints: id }, { $pull: { endpoints: id } }),
    ]);

    return deleted;
  }
}
