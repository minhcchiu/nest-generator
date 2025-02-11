import { UseFilters } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsExceptionsFilter } from "~exceptions/ws-exception.filter";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { SOCKET_EVENTS } from "./constants/socket-event.constant";
import { socketHelper } from "./helpers/socker.helper";
import { SocketService } from "./socket.service";
import { Message } from "./types/message.type";
import { RenameChat } from "./types/rename-chat.type";

@UseFilters(WsExceptionsFilter)
@WebSocketGateway(9898, {
  cors: true,
  pingTimeout: 60000,
  transports: ["websocket"],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private logger: CustomLoggerService,
  ) {}

  afterInit() {
    this.logger.log("Socket initialized", SocketGateway.name);
  }

  async handleConnection(socket: Socket) {
    const user = await this.socketService.getUserFromSocket(socket).catch(() => {
      socket.disconnect(true);
    });

    if (!user) return socket.disconnect(true);

    const userId = user._id;

    // Step 01: Join room
    socket.join(userId.toString());

    // Step 02: Add socket id
    socketHelper.addSocketId(userId.toString(), socket.id);

    // Step 03: Emit to user after login
    socket.emit(SOCKET_EVENTS.UsersOnline, socketHelper.getUsersOnline());

    // Step 04: Emit to all another users
    socket.broadcast.emit(SOCKET_EVENTS.NewUserOnline, userId);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.socketService.getUserFromSocket(socket).catch(() => {
      socket.disconnect(true);
    });

    if (!user) return socket.disconnect(true);

    const userId = user._id.toString();

    // Step 01: Remove socket id
    socketHelper.removeSocketId(userId, socket.id);

    // Step 02: Emit to all another users
    const userSocketId = socketHelper.getSocketIdsByClientId(userId);
    if (!userSocketId) {
      socket.leave(userId);
      socket.broadcast.emit(SOCKET_EVENTS.NewUserOffline, userId);
    }
  }

  // Join chat
  @SubscribeMessage(SOCKET_EVENTS.JoinChat)
  handleJoinChat(socket: Socket, data: { chatId: string }) {
    socket.join(data.chatId);
  }

  // Leave chat
  @SubscribeMessage(SOCKET_EVENTS.LeaveChat)
  handleLeaveChat(socket: Socket, data: { chatId: string }) {
    socket.leave(data.chatId);
  }

  // Rename chat
  @SubscribeMessage(SOCKET_EVENTS.RenameChat)
  handleRenameChat(client: Socket, data: RenameChat) {
    client.to(data.chatId).emit(SOCKET_EVENTS.RenameChat, data);
  }

  // Typing
  @SubscribeMessage(SOCKET_EVENTS.Typing)
  handleTyping(client: Socket, data: { chatId: string }) {
    client.to(data.chatId).emit(SOCKET_EVENTS.Typing);
  }

  // Stop typing
  @SubscribeMessage(SOCKET_EVENTS.StopTyping)
  handleStopTyping(client: Socket, data: { chatId: string }) {
    client.to(data.chatId).emit(SOCKET_EVENTS.StopTyping);
  }

  // New message
  @SubscribeMessage(SOCKET_EVENTS.NewMessage)
  handleNewMessage(client: Socket, data: Message) {
    // check members exist
    if (!data.chat?.members) {
      client.emit(SOCKET_EVENTS.SocketError, "Chat not found.");
      return;
    }

    // send message to all members
    data.chat.members.forEach(({ user }) => {
      if (user._id === data.sender._id) return;
      client.to(user._id).emit(SOCKET_EVENTS.NewMessage, data);
    });
  }
}
