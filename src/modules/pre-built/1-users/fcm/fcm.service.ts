import { Injectable } from "@nestjs/common";
import { MessagingOptions } from "child_process";
import {
	BaseMessage,
	MessagingPayload,
	MessagingTopicResponse,
	MulticastMessage,
} from "firebase-admin/lib/messaging/messaging-api";
import { Types } from "mongoose";
import { FirebaseService } from "~shared/firebase/firebase.service";
import { UserService } from "../user.service";

@Injectable()
export class FcmService {
	constructor(
		private firebaseService: FirebaseService,
		private userService: UserService,
	) {}

	async sendEachForMulticastByTokens(
		tokens: string[],
		baseMessage: BaseMessage,
	) {
		if (tokens.length === 0) return;

		// message item
		const message = this._getMessageForMulticast(tokens, baseMessage);

		// send message
		const resultSent = await this.firebaseService.sendEachForMulticast(message);

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

	async sendEachForMulticastByUserIds(
		userIds: Types.ObjectId[],
		baseMessage: BaseMessage,
	) {
		// get tokens from users
		const tokens: string[] = await this.userService.distinct("fcmTokens", {
			_id: { $in: userIds },
			isFCMEnabled: true,
		});

		if (tokens.length === 0) return;

		// message item
		const message = this._getMessageForMulticast(tokens, baseMessage);

		// send message
		const resultSent = await this.firebaseService.sendEachForMulticast(message);

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

	async sendToTopic(
		topic: string,
		payload: MessagingPayload,
		options?: MessagingOptions,
	): Promise<MessagingTopicResponse> {
		return this.firebaseService.sendToTopic(topic, payload, options);
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
}
