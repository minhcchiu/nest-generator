import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '../1-users/enums/role.enum';
import { MenuLevel } from './enum/menu-level';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'menus',
})
export class Menu {
  @Prop({ type: ObjectId })
  readonly parentId?: ObjectId;

  @Prop({ type: String, default: '' })
  readonly title: string;

  @Prop({ type: String, default: '' })
  readonly prefix: string;

  @Prop({ type: String, default: '' })
  readonly icon?: string;

  @Prop({ type: Number, enum: MenuLevel, default: MenuLevel.ONE })
  readonly level: MenuLevel;

  @Prop({ type: String, default: '' })
  readonly url?: string;

  @Prop({ type: Number, default: 0 })
  readonly position?: number;

  @Prop({ type: Boolean, default: false })
  readonly isHorizontal: boolean;

  @Prop({ type: Boolean, default: true })
  readonly isShow: boolean;

  @Prop({ type: [{ type: String, enum: Role }], default: [Role.SUPER_ADMIN] })
  readonly roles: Role[];
}

export type MenuDocument = HydratedDocument<Menu>;
export const MenuSchema = SchemaFactory.createForClass(Menu);
