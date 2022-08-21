import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from 'src/base-inherit/base.service';
import { Province, ProvinceDocument } from './schemas/province.schema';

@Injectable()
export class ProvinceService extends BaseService<ProvinceDocument> {
  constructor(
    @InjectModel(Province.name) model: PaginateModel<ProvinceDocument>,
  ) {
    super(model);
  }
}
