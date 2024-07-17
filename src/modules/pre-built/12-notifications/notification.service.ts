import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { LanguageCodeEnum } from "~enums/language.enum";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationType } from "./enums/noti-type.enum";
import { Notification, NotificationDocument } from "./schemas/notification.schema";
import { notificationTranslate } from "./trans/nottification.translate";

@Injectable()
export class NotificationService extends BaseService<NotificationDocument> {
  constructor(@InjectModel(Notification.name) model: Model<NotificationDocument>) {
    super(model);
  }

  async createNotification(input: CreateNotificationDto) {
    switch (input.type) {
      case NotificationType.Post:
        return this._createPostNotification(input);

      case NotificationType.Comment:
        return this._createCommentNotification(input);

      default:
        throw new BadRequestException("Invalid notification type");
    }
  }

  addNotificationDetail(notification: any, language: LanguageCodeEnum) {
    switch (notification.type) {
      case NotificationType.Post:
        Object.assign(notification, {
          content: notificationTranslate.post.content[language],
        });

        break;

      case NotificationType.Comment:
        Object.assign(notification, {
          content: notificationTranslate.comment.content(notification.senderId?.fullName)[language],
        });

        break;
    }
  }

  private _createCommentNotification(input: CreateNotificationDto) {
    return this.create(input);
  }

  private _createPostNotification(input: CreateNotificationDto) {
    return this.create(input);
  }
}
