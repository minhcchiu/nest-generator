import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Document, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Setting } from "~modules/pre-built/11-settings/schemas/setting.schema";
import { Notification } from "~modules/pre-built/12-notifications/schemas/notification.schema";
@Schema({ timestamps: true, versionKey: false, collection: "user_items" })
export class UserItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  discountValue: number;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: [{ type: String }], default: [] })
  strings: Array<string> = [];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Notification.name }], default: [] })
  notifications: Array<ObjectId> = [];

  @Prop({
    type: {
      settingId: { type: SchemaTypes.ObjectId, ref: Setting.name },
      code: { type: String },
      discountValue: { type: Number, min: 0, max: 100 },
    },
    default: { settingId: "123", code: "12310", discountValue: 10 },
  })
  object: Record<string, any> = { settingId: "123", code: "12310", discountValue: 10 };

  @Prop({ type: [{ type: Number, min: 0, max: 100 }], default: [0] })
  numbers: Array<number> = [0];

  @Prop({
    type: [
      {
        settingId: { type: SchemaTypes.ObjectId, ref: Setting.name },
        code: { type: String },
        discountValue: { type: Number, min: 0, max: 100 },
      },
    ],
    default: [{ userId: "", code: "123", discountValue: 1 }],
  })
  orderItems: Array<any> = [{ userId: "", code: "123", discountValue: 1 }];
}

export type UserItemDocument = UserItem & Document;
export const UserItemSchema = SchemaFactory.createForClass(UserItem);
