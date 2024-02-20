import { Injectable } from "@nestjs/common";
import { MessagingOptions } from "child_process";
import {
	BaseMessage,
	MessagingPayload,
	MessagingTopicResponse,
	MulticastMessage,
} from "firebase-admin/lib/messaging/messaging-api";
import { FirebaseService } from "~shared/firebase/firebase.service";
import { UserService } from "../user.service";
import { Types } from "mongoose";
import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

@Injectable()
export class UserFirebaseService {
	constructor(
		private logger: CustomLoggerService,
		private firebaseService: FirebaseService,
		private userService: UserService,
	) {}

	async getUser() {
		const userIds = [
			"65ac022cbda46125ca57d979",
			"65ac01f9bda46125ca57d972",
			"65a93849fb70ad9e52584126",
		];

		await this.sendEachForMulticastByUserIds(
			userIds.map(stringIdToObjectId),
			{
				notification: {
					title: "hello",
					body: "hello",
					imageUrl:
						"https://th.bing.com/th/id/OIP.fjAxHcSzmCKsbKFqWaCBkwHaEK?rs=1&pid=ImgDetMain",
				},
			},
			true,
		);
	}

	async sendEachForMulticastByUserIds(
		userIds: Types.ObjectId[],
		baseMessage: BaseMessage,
		dryRun?: boolean,
	) {
		// get tokens from users
		const tokens = await this.userService.distinct("fcmTokens", {
			_id: { $in: userIds },
			isFCMEnabled: true,
		});

		if (tokens.length === 0) return;

		// get message
		const message = this._getMessageForMulticast(tokens, baseMessage);

		// send
		const resultSent = await this.firebaseService.sendEachForMulticast(
			message,
			dryRun,
		);

		// get invalid tokens
		const invalidTokens = resultSent.responses.reduce((acc, result, index) => {
			if (!result.success) acc.push(tokens[index]);

			return acc;
		}, []);

		// remove invalid tokens
		if (invalidTokens.length > 0) {
			this.userService.removeFcmTokens(invalidTokens).catch(() => {
				// ignore
			});
		}
	}

	private _getMessageForMulticast(tokens: string[], baseMessage: BaseMessage) {
		const {
			notification,
			android = { notification: { sound: "default" } },
			apns = {
				payload: {
					aps: {
						badge: 1,
						sound: "default",
					},
				},
			},
			data = {},
			fcmOptions = {},
			webpush = {},
		} = baseMessage;

		const message: MulticastMessage = {
			tokens,
			notification,
			android,
			apns,
			data,
			fcmOptions,
			webpush,
		};

		return message;
	}

	async sendToTopic(
		topic: string,
		payload: MessagingPayload,
		options?: MessagingOptions,
	): Promise<MessagingTopicResponse> {
		return this.firebaseService.sendToTopic(topic, payload, options);
	}
}
