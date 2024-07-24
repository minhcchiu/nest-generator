import { Socket } from "socket.io";

const clients: Record<string, string[]> = {};

class SocketHelper {
  addSocketId(clientId: string, socketId: string) {
    if (!clients[clientId]) clients[clientId] = [];

    clients[clientId].push(socketId);

    return clients;
  }

  emitNotifyTo(clientId: string, io: Socket, eventName: string, data: any) {
    clients[clientId].forEach(socketId => io.to(socketId).emit(eventName, data));
  }

  removeSocketId(clientId: string, deleteSocketId: string) {
    clients[clientId] = clients[clientId].filter(socketId => socketId !== deleteSocketId);

    if (!clients[clientId].length) delete clients[clientId];

    return clients[clientId];
  }

  getUsersOnline() {
    return Object.keys(clients);
  }

  getSocketIdsByClientId(clientId: string) {
    return clients[clientId];
  }
}

export const socketHelper = new SocketHelper();
