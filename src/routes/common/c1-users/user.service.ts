import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateModel, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';

import { BaseService } from '~base-inherit/base.service';
import { User, UserDocument } from './schemas/user.schema';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  private _userModel: PaginateModel<UserDocument>;
  constructor(@InjectModel(User.name) userModel: PaginateModel<UserDocument>) {
    super(userModel);

    this._userModel = userModel;
  }

  /**
   * Create User
   *
   * @param data
   * @returns
   */
  async create(data: any) {
    const filterValidate = {};

    if (data.phone) filterValidate['phone'] = data.phone;

    if (data.email) filterValidate['email'] = data.email;

    // validate unquie key
    await this.validateCreateUser(filterValidate);

    const userItem = {
      ...data,
      deviceID: data.deviceID ? data.deviceID : '',
      fcmTokens: data.deviceID ? [data.deviceID] : [],
    };

    return this._userModel.create(userItem);
  }

  /**
   * Validate create user
   *
   * @param filter
   * @returns
   */
  async validateCreateUser(filter: object) {
    // validate user
    const userExist = await this.findOne(filter);

    // check user exist
    if (userExist) {
      if (!userExist.deleted)
        throw new BadRequestException('Account already exists in the system.');

      // Delete old filter key
      await this.updateById(userExist._id, {
        [Object.keys(filter)[0]]: '',
      });
    }

    return true;
  }

  /**
   * check password by id
   *
   * @param id
   * @param password
   * @returns
   */
  async checkPasswordById(
    id: Types.ObjectId,
    password: string,
  ): Promise<boolean> {
    const user = await this.findById(id, { projection: '+password' });

    if (user) {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (isPasswordValid) return true;
    }

    throw new BadRequestException('Incorrect account.');
  }

  /**
   * Update password
   *
   * @param id
   * @param newPassword
   * @returns
   */
  async updatePasswordById(id: Types.ObjectId, newPassword: string) {
    const user = await this._userModel.findById(id);

    if (!user) throw new NotFoundException('User not found.');

    // update password
    user.password = newPassword;

    await user.save();

    return user.toObject();
  }

  /**
   * Add device ID
   *
   * @param id
   * @param deviceID
   * @returns
   */
  async addDeviceID(
    id: Types.ObjectId,
    deviceID: string,
  ): Promise<UserDocument | null> {
    const updateData = { deviceID, $addToSet: { fcmTokens: deviceID } };

    return this.updateById(id, updateData);
  }

  /**
   * Remove device ID
   *
   * @param id
   * @param deviceID
   * @returns
   */
  async removeDeviceID(id: Types.ObjectId, deviceID: string) {
    const updateData = { deviceID: '', $pull: { fcmTokens: deviceID } };

    const user = await this.updateById(id, updateData);

    // if fcmTokens includes "DeviceID" => update: deviceID = user.fcmTokens[0]
    if (user?.fcmTokens.includes(deviceID)) {
      await this.updateById(user._id, {
        deviceID: user.fcmTokens[0] || '',
      });
    }

    return user;
  }

  /**
   * Validate user
   *
   * @param data
   * @returns
   */
  async findUserExist(data: ValidateUserDto) {
    const { phone, authKey, email } = data;

    if (phone) {
      const userExists = await this.findOne({ phone });

      if (userExists) return userExists;
    }

    // check tokenLogin exist
    if (authKey) {
      const userExists = await this.findOne({ authKey });

      if (userExists) return userExists;
    }

    // check email exist
    if (email) {
      const userExists = await this.findOne({ email });

      if (userExists) return userExists;
    }

    return null;
  }
}
