import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { PaginateModel } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

@Injectable()
export class NotificationService extends BaseService<NotificationDocument> {
  constructor(@InjectModel(Notification.name) model: PaginateModel<NotificationDocument>) {
    super(model);
  }
}
