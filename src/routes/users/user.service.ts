import * as argon2 from 'argon2';
import { PaginateModel, Types } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  private userModel: PaginateModel<UserDocument>;
  constructor(@InjectModel(User.name) model: PaginateModel<UserDocument>) {
    super(model);
    this.userModel = model;
  }

  async create(data: CreateUserDto) {
    await this.validateCreateUser(data);
    return this.create(data);
  }

  async validateCreateUser({ phone, email }: { phone?: string; email?: string }) {
    if (phone && (await this.count({ phone }))) {
      throw new BadRequestException('Account already exists in the system.');
    }

    if (email && (await this.count({ email }))) {
      throw new BadRequestException('Account already exists in the system.');
    }

    return true;
  }

  async updatePasswordById(id: Types.ObjectId, { newPassword, oldPassword }: UpdatePasswordDto) {
    const user = await this.userModel.findById(id).select('password');

    if (!user) throw new NotFoundException('User not found.');

    const validOldPass = await argon2.verify(user.password, oldPassword);

    if (!validOldPass) throw new UnauthorizedException('Invalid old password.');

    user.password = newPassword;
    return user.save();
  }

  async addDeviceID(id: Types.ObjectId, deviceID: string): Promise<UserDocument | null> {
    const updateData = { deviceID, $addToSet: { fcmTokens: deviceID } };

    return this.updateById(id, updateData);
  }

  async removeDeviceID(id: Types.ObjectId, deviceID: string) {
    const updateData = { deviceID: '', $pull: { fcmTokens: deviceID } };

    return this.updateById(id, updateData);
  }
}
