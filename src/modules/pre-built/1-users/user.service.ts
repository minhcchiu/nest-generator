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
import { UserQuestionActivityService } from "~modules/questions-modules/2-user-question-activities/user_question_activity.service";
import { TagService } from "~modules/questions-modules/3-tags/tag.service";
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
    private readonly tagService: TagService,
    private readonly userQuestionActivityService: UserQuestionActivityService,
  ) {
    super(model);

    this.userService = this;
  }

  async validateCreateUser(input: Record<string, any>) {
    if (input.email) {
      const userExist = await this.userService.findOne({ email: input.email });

      if (userExist) throw new BadRequestException(`Email already exist.`);
    }

    if (input.phone) {
      const userExist = await this.userService.findOne({ phone: input.phone });

      if (userExist) throw new BadRequestException(`Phone already exist.`);
    }

    if (input.username) {
      const userExist = await this.userService.findOne({
        username: input.username,
      });

      if (userExist) throw new BadRequestException(`Username already exist.`);
    }
  }

  async createUser(input: CreateUserDto) {
    await this.validateCreateUser(input);

    const hashPassword = await this.hashingService.hash(input.password);
    Object.assign(input, { password: hashPassword });

    const userCreated = await this.userService.create(input);

    // Seed data for user
    await this.userQuestionActivityService.seedUserQuestionActivity(userCreated._id);

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
    const updated = await this.userService.updateById(
      id,
      { $addToSet: { fcmTokens: fcmToken } },
      { projection: { _id: 1, fcmTokens: 1 } },
    );

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
  async assignTopInteractedTags(users: UserDocument[]) {
    const topInteractedTags = await this.tagService.getTopInteractedTagsByUserIds(
      users.map(user => user._id),
    );

    const topInteractedTagsMap = new Map(
      topInteractedTags.map(topInteractedTag => [
        topInteractedTag.authorId.toString(),
        topInteractedTag,
      ]),
    );

    users.forEach(user => {
      Object.assign(user, {
        topInteractedTags: topInteractedTagsMap.get(user._id.toString())?.tags || [],
      });
    });

    return users;
  }
}
