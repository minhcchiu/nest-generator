import { AuthAccess, AuthAccessDocument } from './schemas/auth-access.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class AuthAccessService extends BaseService<AuthAccessDocument> {
  constructor(@InjectModel(AuthAccess.name) model: PaginateModel<AuthAccessDocument>) {
    super(model);
  }
}
