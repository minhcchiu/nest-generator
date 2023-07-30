import * as argon2 from "argon2";

import { PaginateModel, QueryOptions } from "mongoose";
import { BaseService } from "~base-inherit/base.service";

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { UpdatePasswordDto } from "./dto/update-password";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService extends BaseService<UserDocument> {
	private userModel: PaginateModel<UserDocument>;
	constructor(@InjectModel(User.name) model: PaginateModel<UserDocument>) {
		super(model);
		this.userModel = model;
	}

	async validateCreateUser({
		phone,
		email,
	}: {
		phone?: string;
		email?: string;
	}) {
		let isExistUser = false;

		if (phone && (await this.count({ phone }))) {
			isExistUser = true;
		}

		if (email && (await this.count({ email }))) {
			isExistUser = true;
		}

		if (isExistUser)
			throw new BadRequestException("Account already exists in the system.");

		return true;
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

	async addDeviceID(
		id: string,
		deviceID: string,
	): Promise<UserDocument | null> {
		return this.updateById(
			id,
			{ $addToSet: { fcmTokens: deviceID } },
			{ projection: { _id: "1", fcmTokens: 1 } },
		);
	}

	async removeDeviceID(id: string, deviceID: string) {
		console.log({ id, deviceID });

		return this.updateById(
			id,
			{ $pull: { fcmTokens: deviceID } },
			{ projection: { _id: "1", fcmTokens: 1 } },
		);
	}

	async comparePassword(hashPassword: string, plainPassword: string) {
		return argon2.verify(hashPassword, plainPassword);
	}
}
