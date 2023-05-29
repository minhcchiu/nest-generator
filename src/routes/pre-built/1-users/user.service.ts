import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import { PaginateModel, QueryOptions } from 'mongoose';
import { BaseService } from '~base-inherit/base.service';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UpdatePasswordDto } from './dto/update-password';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  private userModel: PaginateModel<UserDocument>;
  constructor(@InjectModel(User.name) model: PaginateModel<UserDocument>) {
    super(model);
    this.userModel = model;
  }

  async create(data: any) {
    await this.validateCreateUser({ phone: data.phone, email: data.email });
    return this.userModel.create(data);
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

  async updatePasswordById(id: ObjectId, { newPassword, oldPassword }: UpdatePasswordDto) {
    const user = await this.userModel.findById(id).select('password');

    if (!user) throw new NotFoundException('User not found.');

    const validOldPass = await this.comparePassword(oldPassword, newPassword);

    if (!validOldPass) throw new UnauthorizedException('Invalid old password.');

    user.password = newPassword;
    return user.save();
  }

  async resetPassword(id: ObjectId, newPassword: string, options?: QueryOptions) {
    const user = await this.userModel.findById(id, options.projection, options);
    if (!user) throw new NotFoundException('User not found.');

    user.password = newPassword;
    return user.save();
  }

  async addDeviceID(id: ObjectId, deviceID: string): Promise<UserDocument | null> {
    const updateData = { deviceID, $addToSet: { fcmTokens: deviceID } };

    return this.updateById(id, updateData);
  }

  async removeDeviceID(id: ObjectId, deviceID: string) {
    const updateData = { deviceID: '', $pull: { fcmTokens: deviceID } };

    return this.updateById(id, updateData);
  }

  async comparePassword(hashPassword: string, plainPassword: string) {
    return argon2.verify(hashPassword, plainPassword);
  }
}
