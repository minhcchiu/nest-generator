import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { EndpointGroup } from './schemas/endpoint-group.schema';

@Injectable()
export class EndpointGroupService extends BaseService<EndpointGroup> {
  constructor(@InjectModel(EndpointGroup.name) model: PaginateModel<EndpointGroup>) {
    super(model);
  }
}
