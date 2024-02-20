import * as firebaseAdmin from "firebase-admin";
import {
	BatchResponse,
	Message,
	MessagingOptions,
	MessagingPayload,
	MessagingTopicResponse,
	MulticastMessage,
} from "firebase-admin/lib/messaging/messaging-api";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class FirebaseService {
	constructor(private logger: CustomLoggerService) {
		this.init();
	}

	init() {
		const serviceAccount = this._getServiceAccount();

		firebaseAdmin.initializeApp({
			credential: firebaseAdmin.credential.cert(serviceAccount),
		});

		this.logger.log("FcmModule init success", "FirebaseService");
	}

	private _getServiceAccount() {
		const fileService = join(__dirname, "./service-account.json");

		if (existsSync(fileService)) {
			const serviceAccount = readFileSync(fileService).toString();

			return JSON.parse(serviceAccount);
		} else {
			throw new Error("firebase-service-account.json was not found");
		}
	}

	async verifyIdToken(
		idToken: string,
	): Promise<firebaseAdmin.auth.DecodedIdToken> {
		return firebaseAdmin.auth().verifyIdToken(idToken);
	}

	async send(message: Message, dryRun?: boolean): Promise<string> {
		return firebaseAdmin.messaging().send(message, dryRun);
	}

	async sendEach(message: Message[], dryRun?: boolean): Promise<BatchResponse> {
		return firebaseAdmin.messaging().sendEach(message, dryRun);
	}

	async sendEachForMulticast(
		message: MulticastMessage,
		dryRun?: boolean,
	): Promise<BatchResponse> {
		return firebaseAdmin.messaging().sendEachForMulticast(message, dryRun);
	}

	async sendToTopic(
		topic: string,
		payload: MessagingPayload,
		options?: MessagingOptions,
	): Promise<MessagingTopicResponse> {
		return firebaseAdmin.messaging().sendToTopic(topic, payload, options);
	}
}
