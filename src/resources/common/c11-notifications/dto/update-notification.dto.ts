import { CreateNotificationDto } from './create-notification.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
