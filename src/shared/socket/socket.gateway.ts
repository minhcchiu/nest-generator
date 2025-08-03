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
import { UserService } from "~modules/pre-built/1-users/user.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";
import { SOCKET_EVENTS } from "./constants/socket-event.constant";
import { socketHelper } from "./helpers/socker.helper";
import { SocketService } from "./socket.service";
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
    private logger: CustomLoggerService,
    private readonly socketService: SocketService,
    private readonly userService: UserService,
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

    // Step 05: Update online status
    this.userService.toggleOnline(userId, true).catch(() => {
      socket.disconnect(true);
    });
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.socketService.getUserFromSocket(socket).catch(() => {
      socket.disconnect(true);
    });

    if (!user) return socket.disconnect(true);

    const userId = user._id;

    // Step 01: Remove socket id
    socketHelper.removeSocketId(userId.toString(), socket.id);

    // Step 02: Emit to all another users
    const userSocketId = socketHelper.getSocketIdsByClientId(userId.toString());
    if (!userSocketId) {
      socket.leave(userId.toString());
      socket.broadcast.emit(SOCKET_EVENTS.NewUserOffline, userId.toString());

      // Step 03: Update online status
      this.userService.toggleOnline(userId, false).catch(() => {
        // Do nothing
      });
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
    data.receiverIds.forEach(receiverId => {
      client.to(receiverId).emit(SOCKET_EVENTS.RenameChat, data);
    });
  }

  // Typing
  @SubscribeMessage(SOCKET_EVENTS.Typing)
  handleTyping(client: Socket, data: { chatId: string; receiverIds: string[] }) {
    data.receiverIds.forEach(receiverId => {
      client.to(receiverId).emit(SOCKET_EVENTS.Typing);
    });
  }

  // Stop typing
  @SubscribeMessage(SOCKET_EVENTS.StopTyping)
  handleStopTyping(client: Socket, data: { chatId: string; receiverIds: string[] }) {
    data.receiverIds.forEach(receiverId => {
      client.to(receiverId).emit(SOCKET_EVENTS.StopTyping);
    });
  }

  // New message
  @SubscribeMessage(SOCKET_EVENTS.NewMessage)
  handleNewMessage(client: Socket, data: { chatId: string; receiverIds: string[] }) {
    // check members exist
    if (!data.receiverIds) {
      client.emit(SOCKET_EVENTS.SocketError, "Chat not found.");
      return;
    }

    // send message to all members
    data.receiverIds.forEach(receiverId => {
      client.to(receiverId).emit(SOCKET_EVENTS.NewMessage, data);
    });
  }
}
