import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model, QueryOptions } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { SUPPER_ADMIN_ACCOUNT } from "~utils/constant";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { HashingService } from "./hashing/hashing.service";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService extends BaseService<UserDocument> {
  private userService: UserService;

  constructor(
    @InjectModel(User.name) model: Model<UserDocument>,
    private readonly hashingService: HashingService,
  ) {
    super(model);
    this.userService = this;
  }

  async getAdminAccount() {
    const admin = await this.userService.findOne({
      username: SUPPER_ADMIN_ACCOUNT.username,
      email: SUPPER_ADMIN_ACCOUNT.email,
      status: SUPPER_ADMIN_ACCOUNT.status,
    });

    return admin;
  }

  async validateCreateUser(input: Record<string, any>, otherFilter: Record<string, any> = {}) {
    const conditions = [];

    if (input.email) conditions.push({ field: "email", value: input.email });
    if (input.phone) conditions.push({ field: "phone", value: input.phone });
    if (input.username) conditions.push({ field: "username", value: input.username });

    if (conditions.length > 0) {
      const userExist = await this.userService.findOne({ $or: conditions, ...otherFilter });

      if (userExist) {
        const conflictField = conditions.find(condition =>
          Object.keys(condition).some(key => userExist[key] === condition[key]),
        );
        const fieldName = conflictField && Object.keys(conflictField)[0];
        throw new BadRequestException(
          `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists.`,
        );
      }
    }
  }

  async createUser(input: CreateUserDto) {
    await this.validateCreateUser(input);

    const hashPassword = await this.hashingService.hash(input.password);
    Object.assign(input, { password: hashPassword });

    const userCreated = await this.userService.create(input);

    return userCreated;
  }

  async updatePasswordById(id: ObjectId, { newPassword, oldPassword }: UpdatePasswordDto) {
    const user = await this.userService.findById(id, {
      projection: "password",
    });

    if (!user) throw new NotFoundException("User not found.");

    const validPass = await this.hashingService.compare(user.password, oldPassword);

    if (!validPass) throw new UnauthorizedException("Invalid old password.");

    const hashPassword = await this.hashingService.hash(newPassword);

    return this.userService.updateById(user._id, { password: hashPassword });
  }

  async resetPasswordBy(filter: Record<string, any>, newPassword: string, options?: QueryOptions) {
    const hashPassword = await this.hashingService.hash(newPassword);

    const updated = await this.userService.updateOne(filter, { password: hashPassword }, options);

    if (!updated) throw new NotFoundException("User not found.");

    return updated;
  }

  async resetPasswordById(id: ObjectId, newPassword: string, options?: QueryOptions) {
    const hashPassword = await this.hashingService.hash(newPassword);

    const updated = await this.userService.updateById(id, { password: hashPassword }, options);

    if (!updated) throw new NotFoundException("User not found.");

    return updated;
  }

  async saveFcmToken(id: ObjectId, fcmToken: string): Promise<UserDocument | null> {
    const updated = await this.userService.updateById(id, { $addToSet: { fcmTokens: fcmToken } });

    return updated;
  }

  async removeFcmTokens(fcmTokens: string[]) {
    const updated = await this.userService.updateMany(
      {
        fcmTokens: { $in: fcmTokens },
      },
      {
        $pull: { fcmTokens: { $in: fcmTokens } },
      },
    );

    return updated;
  }

  // features
}
