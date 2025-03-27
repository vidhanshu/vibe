import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebsocketsService {
  private server: Server;
  private connectedUserSockets: Map<string, string> = new Map(); // Map<userId, socketId>

  setServer(server: Server) {
    this.server = server;
  }

  emit(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    }
  }

  emitToRoom(room: string, event: string, data: any) {
    if (this.server) {
      this.server.to(room).emit(event, data);
    }
  }

  addUserSocket(userId: string, socketId: string) {
    this.connectedUserSockets.set(userId, socketId);
  }

  removeUserSocket(userId: string) {
    this.connectedUserSockets.delete(userId);
  }

  getUserSocket(userId: string): string | undefined {
    return this.connectedUserSockets.get(userId);
  }

  getAllConnectedUsers(): Map<string, string> {
    return this.connectedUserSockets;
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUserSockets.get(userId);
    if (socketId && this.server) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
