import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/base-inherit/base.service';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) model: PaginateModel<UserDocument>) {
    super(model);
  }
}
