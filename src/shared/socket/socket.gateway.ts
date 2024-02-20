import { Server, Socket } from "socket.io";
import { WsExceptionsFilter } from "~exceptions/ws-exception.filter";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

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

import { SocketService } from "./socket.service";
import { Message } from "./types/message.type";
import { RenameChat } from "./types/rename-chat.type";
import { SocketEvent } from "./enums/socket-event.enum";

@UseFilters(WsExceptionsFilter)
@WebSocketGateway(9898, {
	cors: true,
	pingTimeout: 60000,
	transports: ["websocket"],
})
export class SocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly socketService: SocketService,
		private logger: CustomLoggerService,
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
	@SubscribeMessage(SocketEvent.JoinChat)
	handleJoinChat(client: Socket, chatId: string) {
		client.join(chatId);
	}

	// Rename chat
	@SubscribeMessage(SocketEvent.RenameChat)
	handleRenameChat(client: Socket, data: RenameChat) {
		client.to(data.chatId).emit(SocketEvent.RenameChat, data);
	}

	// Typing
	@SubscribeMessage(SocketEvent.Typing)
	handleTyping(client: Socket, chatId: string) {
		client.to(chatId).emit(SocketEvent.Typing);
	}

	// Stop typing
	@SubscribeMessage(SocketEvent.StopTyping)
	handleStopTyping(client: Socket, chatId: string) {
		client.to(chatId).emit(SocketEvent.StopTyping);
	}

	// Notification
	@SubscribeMessage(SocketEvent.NewNotification)
	handleStopNotificationReceived(client: Socket, userId: string) {
		client.to(userId).emit(SocketEvent.NewNotification, userId);
	}

	// New message
	@SubscribeMessage(SocketEvent.NewMessage)
	handleNewMessage(client: Socket, data: Message) {
		// check members exist
		if (!data.chat?.members) {
			client.emit(SocketEvent.Error, "Chat not found.");
			return;
		}

		// send message to all members
		data.chat.members.forEach(({ user }) => {
			if (user._id === data.sender._id) return;
			client.to(user._id).emit(SocketEvent.NewMessage, data);
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
