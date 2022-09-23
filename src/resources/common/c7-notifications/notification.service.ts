import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '~base-inherit/base.service';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService extends BaseService<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name) model: PaginateModel<NotificationDocument>,
  ) {
    super(model);
  }
}
