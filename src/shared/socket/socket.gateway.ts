import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service";
import { WsExceptionsFilter } from "~exceptions/ws-exception.filter";
import { UseFilters } from "@nestjs/common";
import { Logger } from "~shared/logger/logger.service";
import { EVENTS } from "./enums/events.enum";
import { RenameChat } from "./types/rename-chat.type";
import { Message } from "./types/message.type";

@UseFilters(WsExceptionsFilter)
@WebSocketGateway(9898, { cors: true, pingTimeout: 60000 })
export class SocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly socketService: SocketService,
		private logger: Logger,
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
			client.to(data.chat._id).emit(EVENTS.error, "Chat not found.");

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
}
