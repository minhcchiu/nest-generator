import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '~base-inherit/base.service';
import { District, DistrictDocument } from './schemas/district.schema';

@Injectable()
export class DistrictService extends BaseService<DistrictDocument> {
  constructor(
    @InjectModel(District.name) model: PaginateModel<DistrictDocument>,
  ) {
    super(model);
  }
}
