import { ApiResource, ApiResourceDocument } from './schemas/api-resource.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class ApiResourceService extends BaseService<ApiResourceDocument> {
  constructor(@InjectModel(ApiResource.name) model: PaginateModel<ApiResourceDocument>) {
    super(model);
  }
}
