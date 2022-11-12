import { RightsGroup, RightsGroupDocument } from './schemas/rights-group.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class RightsGroupService extends BaseService<RightsGroupDocument> {
  constructor(@InjectModel(RightsGroup.name) model: PaginateModel<RightsGroupDocument>) {
    super(model);
  }
}
