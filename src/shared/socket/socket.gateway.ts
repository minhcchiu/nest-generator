import { Server, Socket } from "socket.io";
import { WsExceptionsFilter } from "~exceptions/ws-exception.filter";
import { CustomLogger } from "~shared/logger/logger.service";

import { UseFilters } from "@nestjs/common";
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";

import { EVENTS } from "./enums/events.enum";
import { SocketService } from "./socket.service";
import { Message } from "./types/message.type";
import { RenameChat } from "./types/rename-chat.type";

@UseFilters(WsExceptionsFilter)
@WebSocketGateway(9898, { cors: true, pingTimeout: 60000 })
export class SocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly socketService: SocketService,
		private logger: CustomLogger,
	) {}

	afterInit() {
		this.logger.log("Socket initialized", SocketGateway.name);
	}

	async handleConnection(client: Socket) {
		try {
			const user = await this.socketService.getUserFromSocket(client);

			if (!user) client.disconnect(true);

			// join room
			client.join(user._id);

			this.logger.log(
				`User ${client.id} has connected room #${user._id}.`,
				SocketGateway.name,
			);
		} catch (e) {
			client.disconnect(true);
		}
	}

	async handleDisconnect(client: Socket) {
		try {
			const user = await this.socketService.getUserFromSocket(client);

			if (!user) client.disconnect(true);

			// leave room
			client.leave(user._id);

			this.logger.log(
				`User ${client.id} left room #${user._id}.`,
				SocketGateway.name,
			);
		} catch (e) {
			client.disconnect(true);
		}
	}

	// Join chat
	@SubscribeMessage(EVENTS.joinChat)
	handleJoinChat(client: Socket, chatId: string) {
		client.join(chatId);
	}

	// Rename chat
	@SubscribeMessage(EVENTS.renameChat)
	handleRenameChat(client: Socket, data: RenameChat) {
		client.to(data.chatId).emit(EVENTS.renameChat, data);
	}

	// Typing
	@SubscribeMessage(EVENTS.typing)
	handleTyping(client: Socket, chatId: string) {
		client.to(chatId).emit(EVENTS.typing);
	}

	// Stop typing
	@SubscribeMessage(EVENTS.stopTyping)
	handleStopTyping(client: Socket, chatId: string) {
		client.to(chatId).emit(EVENTS.stopTyping);
	}

	// Notification
	@SubscribeMessage(EVENTS.notificationReceived)
	handleStopNotificationReceived(client: Socket, userId: string) {
		client.to(userId).emit(EVENTS.notificationReceived, userId);
	}

	// New message
	@SubscribeMessage(EVENTS.newMessage)
	handleNewMessage(client: Socket, data: Message) {
		// check members exist
		if (!data.chat?.members) {
			client.emit(EVENTS.error, "Chat not found.");
			return;
		}

		// send message to all members
		data.chat.members.forEach(({ user }) => {
			if (user._id === data.sender._id) return;
			client.to(user._id).emit(EVENTS.messageReceived, data);
		});
	}

	@SubscribeMessage("events")
	onEvent(@MessageBody() data: string): string {
		return data;
	}

	onSocketInAPI(data: any) {
		this.server.sockets.emit("send_message", data);
	}

	// Join call video
	@SubscribeMessage(EVENTS.joinCallVideo)
	handleJoinCallVideo(client: Socket, roomId: string) {
		client.join(roomId);
	}

	// Handle offer call video
	@SubscribeMessage(EVENTS.offerCallVideo)
	handleOfferCallVideo(client: Socket, data: any) {
		client.to(data.roomId).emit(EVENTS.offerCallVideo, data.offer);
	}

	// Handle answer call video
	@SubscribeMessage(EVENTS.answerCallVideo)
	handleAnswerCallVideo(client: Socket, data: any) {
		client.to(data.roomId).emit(EVENTS.answerCallVideo, data.offer);
	}

	// Handle offer call video
	@SubscribeMessage(EVENTS.iceCandidate)
	handleIceCandidate(client: Socket, data: any) {
		client.to(data.roomId).emit(EVENTS.iceCandidate, data.offer);
	}
}
