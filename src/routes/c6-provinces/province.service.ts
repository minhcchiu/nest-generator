import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class ProvinceService extends BaseService<ProvinceDocument> {
  constructor(@InjectModel(Province.name) model: PaginateModel<ProvinceDocument>) {
    super(model);
  }
}
