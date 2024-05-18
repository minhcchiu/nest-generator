import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryOptions, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
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

		return this.userService.create(input);
	}

	async updatePasswordById(
		id: Types.ObjectId,
		{ newPassword, oldPassword }: UpdatePasswordDto,
	) {
		const user = await this.userService.findById(id, {
			projection: "password",
		});

		if (!user) throw new NotFoundException("User not found.");

		const validPass = await this.hashingService.compare(
			user.password,
			oldPassword,
		);

		if (!validPass) throw new UnauthorizedException("Invalid old password.");

		const hashPassword = await this.hashingService.hash(newPassword);

		return this.userService.updateById(user._id, { password: hashPassword });
	}

	async resetPassword(
		id: Types.ObjectId,
		newPassword: string,
		options?: QueryOptions,
	) {
		const hashPassword = await this.hashingService.hash(newPassword);

		const updated = await this.userService.updateById(
			id,
			{ password: hashPassword },
			options,
		);

		if (!updated) throw new NotFoundException("User not found.");

		return updated;
	}

	async saveFcmToken(
		id: Types.ObjectId,
		fcmToken: string,
	): Promise<UserDocument | null> {
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
}
