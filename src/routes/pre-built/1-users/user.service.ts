import * as argon2 from "argon2";
import { PaginateModel, QueryOptions, Types } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { StoreService } from "~routes/1-stores/store.service";

import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { UpdatePasswordDto } from "./dto/update-password";
import { AuthKeys, IAuthKeys } from "./enums/unique-keys";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService extends BaseService<UserDocument> {
	private userModel: PaginateModel<UserDocument>;
	constructor(
		@InjectModel(User.name) model: PaginateModel<UserDocument>,
		@Inject(forwardRef(() => StoreService))
		private storeService: StoreService,
	) {
		super(model);

		this.userModel = model;
	}

	async createUser(input: Record<string, any>) {
		const authKeyObj: IAuthKeys = {
			email: input.email,
			phone: input.phone,
			username: input.username,
		};

		Object.assign(input, {
			authKeys: this._getAuthKeys(authKeyObj).map((item) => item.value),
		});

		return this.userModel.create(input);
	}

	async validateCreateUser(input: IAuthKeys) {
		const validatePromises = this._getAuthKeys(input).map((item) =>
			this._validateAuthKey(
				item.key,
				item.value,
				`${item.key.toUpperCase()} already exists.`,
			),
		);

		await Promise.all(validatePromises);
	}

	async updatePasswordById(
		id: string,
		{ newPassword, oldPassword }: UpdatePasswordDto,
	) {
		const user = await this.userModel.findById(id).select("password");

		if (!user) throw new NotFoundException("User not found.");

		const validOldPass = await this.comparePassword(oldPassword, newPassword);

		if (!validOldPass) throw new UnauthorizedException("Invalid old password.");

		user.password = newPassword;
		return user.save();
	}

	async resetPassword(id: string, newPassword: string, options?: QueryOptions) {
		const user = await this.userModel.findById(id, options.projection, options);
		if (!user) throw new NotFoundException("User not found.");

		user.password = newPassword;
		return user.save();
	}

	async saveFcmToken(
		id: Types.ObjectId,
		fcmToken: string,
	): Promise<UserDocument | null> {
		const updated = await this.updateById(
			id,
			{ $addToSet: { fcmTokens: fcmToken } },
			{ projection: { _id: 1, fcmTokens: 1 } },
		);

		return updated;
	}

	async removeFcmTokens(fcmTokens: string[]) {
		const updated = await this.updateMany(
			{
				fcmTokens: { $in: fcmTokens },
			},
			{
				$pull: { fcmTokens: { $in: fcmTokens } },
			},
		);

		throw new BadRequestException("error");

		return updated;
	}

	async comparePassword(hashPassword: string, plainPassword: string) {
		return argon2.verify(hashPassword, plainPassword);
	}

	private _getAuthKeys(input: IAuthKeys): Record<string, string>[] {
		return AuthKeys.filter((key) => input[key] && AuthKeys.includes(key)).map(
			(key) => ({
				key,
				value: input[key].toString(),
			}),
		);
	}

	private async _validateAuthKey(
		key: string,
		value: string,
		errorMessage: string,
	) {
		if (await this.count({ [key]: value }))
			throw new BadRequestException(errorMessage);
	}
}
