import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Document, SchemaTypes } from "mongoose";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";
import { Ward } from "~modules/pre-built/10-wards/schemas/ward.schema";
import { Setting } from "~modules/pre-built/11-settings/schemas/setting.schema";
import { Notification } from "~modules/pre-built/12-notifications/schemas/notification.schema";
import { Menu } from "~modules/pre-built/4-menus/schemas/menu.schema";
import { Province } from "~modules/pre-built/8-provinces/schemas/province.schema";
import { ObjectDto } from "~modules/user_items/dto/object.dto";
import { Object2Dto } from "~modules/user_items/dto/object2.dto";
import { OrderItemsDto } from "~modules/user_items/dto/order_item.dto";
import { UserDistrictDto } from "~modules/user_items/dto/user_district.dto";
import { UserMenuDto } from "~modules/user_items/dto/user_menu.dto";
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

  @Prop({ type: [{ type: String }] })
  strings: Array<string> = [];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Notification.name }] })
  notifications: Array<ObjectId> = [];

  @Prop({
    type: {
      settingId: { type: SchemaTypes.ObjectId, ref: Setting.name },
      code: { type: String },
      discountValue: { type: Number, min: 0, max: 100 },
    },
    default: {
      settingId: new ObjectId("67f02443166c4c54573cd8ce"),
      code: "12310",
      discountValue: 10,
    },
  })
  object: ObjectDto = {
    settingId: new ObjectId("67f02443166c4c54573cd8ce"),
    code: "12310",
    discountValue: 10,
  };

  @Prop({
    type: {
      isBoolean: { type: Boolean },
      code: { type: String },
      discountValue: { type: Number, min: 0, max: 100 },
    },
    default: { isBoolean: true, code: "12310", discountValue: 10 },
  })
  object2: Object2Dto = { isBoolean: true, code: "12310", discountValue: 10 };

  @Prop({ type: [{ type: Number }], default: [0] })
  numbers: Array<number> = [0];

  @Prop({
    type: [
      {
        provinceId: { type: SchemaTypes.ObjectId, ref: Province.name },
        code: { type: String },
        discountValue: { type: Number, min: 0, max: 100 },
      },
    ],
    default: [
      { provinceId: new ObjectId("67f02443166c4c54573cd8ce"), code: "123", discountValue: 1 },
    ],
  })
  orderItems: Array<OrderItemsDto> = [
    { provinceId: new ObjectId("67f02443166c4c54573cd8ce"), code: "123", discountValue: 1 },
  ];

  @Prop({
    type: {
      userId: { type: SchemaTypes.ObjectId, ref: User.name },
      menuId: { type: SchemaTypes.ObjectId, ref: Menu.name },
    },
  })
  userMenu: UserMenuDto;

  @Prop({
    type: [
      {
        userId: { type: SchemaTypes.ObjectId, ref: User.name },
        wardId: { type: SchemaTypes.ObjectId, ref: Ward.name },
      },
    ],
  })
  userDistrict: Array<UserDistrictDto> = [];
}

export type UserItemDocument = UserItem & Document;
export const UserItemSchema = SchemaFactory.createForClass(UserItem);
