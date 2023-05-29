import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { District, DistrictDocument } from './district.schema';

@Injectable()
export class DistrictService extends BaseService<DistrictDocument> {
  constructor(@InjectModel(District.name) model: PaginateModel<DistrictDocument>) {
    super(model);
  }
}
