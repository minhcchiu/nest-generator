import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from 'src/base-inherit/base.service';
import { Ward, WardDocument } from './schemas/ward.schema';

@Injectable()
export class WardService extends BaseService<WardDocument> {
  constructor(@InjectModel(Ward.name) model: PaginateModel<WardDocument>) {
    super(model);
  }
}
