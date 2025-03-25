import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Message } from '@prisma/client';
import { ChatsService } from './chats.service';

const SOCKET_EVENTS = {
  JOIN_CHAT: 'joinChat',
  LEAVE_CHAT: 'leaveChat',
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',
  UPDATE_MESSAGE: 'updateMessage',
  RECEIVE_UPDATED_MESSAGE: 'receiveUpdateMessage',
  UNSEND_MESSAGE: 'unsendMessage',
  REMOVE_MESSAGE: 'removeMessage',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  UPDATE_CHAT_LIST: 'updateChatList',
};

// TODO: add proper origins later
@WebSocketGateway({ namespace: '/', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedUserSockets: Map<string, string> = new Map(); // Map<userId, socketId>

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private chatService: ChatsService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // Handle connection
  async handleConnection(client: Socket) {
    try {
      const userId = await this.validateToken(client);
      if (!userId) {
        client.disconnect();
        return;
      }

      this.connectedUserSockets.set(userId, client.id);

      // Join all active chat rooms for the user
      // const chats = await this.getUserChats(userId);
      // chats.forEach((chat) => client.join(chat.id));

      client.emit('connected', { message: 'Connected successfully' });
    } catch (error) {
      console.error('Connection error:', error.message);
      client.emit('error', { message: error.message });
      client.disconnect();
    }
  }

  // Handle disconnection
  handleDisconnect(client: Socket) {
    const userId = [...this.connectedUserSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.connectedUserSockets.delete(userId);
    }
  }

  // for the cases where user starts new chat
  @SubscribeMessage(SOCKET_EVENTS.JOIN_CHAT)
  handleJoinChat(client: Socket, payload: { chatId: string }) {
    client.join(payload.chatId);
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_CHAT)
  handleLeaveChat(client: Socket, payload: { chatId: string }) {
    client.leave(payload.chatId);
  }

  @SubscribeMessage(SOCKET_EVENTS.SEND_MESSAGE)
  async handleMessage(client: Socket, payload: Message) {
    const userId = this.getUserIdFromSocketId(client.id);

    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Validate user is part of the chat
    const isMember = !!(await this.isUserInChat({
      userId,
      chatId: payload.chatId,
    }));
    if (!isMember) {
      client.emit('error', { message: 'You are not part of this chat' });
      return;
    }

    // Broadcast the message to the chat room
    this.server.to(payload.chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, payload);
    const chat = await this.chatService.getChat(payload.chatId);
    if (chat) {
      const toUserIds = chat.participants
        .map((p) => p.userId)
        .filter((u) => u !== userId);

      // broad cast to individual participants
      for (const userId of toUserIds) {
        const socketId = this.connectedUserSockets.get(userId);
        if (socketId) {
          this.server.to(socketId).emit(SOCKET_EVENTS.UPDATE_CHAT_LIST, chat);
        }
      }
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.UPDATE_MESSAGE)
  async handleUpdate(
    client: Socket,
    payload: { chatId: string; message: Message },
  ) {
    console.log('[updateMessage]');
    const userId = this.getUserIdFromSocketId(client.id);

    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Validate user is part of the chat
    const isMember = !!(await this.isUserInChat({
      userId,
      chatId: payload.chatId,
    }));
    if (!isMember) {
      client.emit('error', { message: 'You are not part of this chat' });
      return;
    }

    // Broadcast the message to the chat room
    this.server
      .to(payload.chatId)
      .emit(SOCKET_EVENTS.RECEIVE_UPDATED_MESSAGE, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.UNSEND_MESSAGE)
  async unsendMessage(
    client: Socket,
    payload: { chatId: string; messageId: string },
  ) {
    const userId = this.getUserIdFromSocketId(client.id);

    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Validate user is part of the chat
    const isMember = !!(await this.isUserInChat({
      userId,
      chatId: payload.chatId,
    }));
    if (!isMember) {
      client.emit('error', { message: 'You are not part of this chat' });
      return;
    }
    this.server.to(payload.chatId).emit(SOCKET_EVENTS.REMOVE_MESSAGE, payload);
  }

  @SubscribeMessage(SOCKET_EVENTS.TYPING)
  async handleTyping(client: Socket, payload: { chatId: string }) {
    const userId = this.getUserIdFromSocketId(client.id);
    if (!userId) {
      return;
    }
    const isUserInChat = await this.isUserInChat({
      userId: userId,
      chatId: payload.chatId,
    });

    if (!isUserInChat) {
      return client.emit('error', { message: 'User is not part of this chat' });
    }

    client.broadcast.to(payload.chatId).emit(SOCKET_EVENTS.TYPING, {
      userId: userId,
      name: isUserInChat.user.name || isUserInChat.user.username,
      chatId: payload.chatId,
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.STOP_TYPING)
  async handleStopTyping(client: Socket, payload: { chatId: string }) {
    const userId = this.getUserIdFromSocketId(client.id);
    if (!userId) {
      return;
    }
    const isUserInChat = await this.isUserInChat({
      userId: userId,
      chatId: payload.chatId,
    });

    if (!isUserInChat) {
      return client.emit('error', { message: 'User is not part of this chat' });
    }

    client.broadcast.to(payload.chatId).emit(SOCKET_EVENTS.STOP_TYPING, {
      userId: userId,
      name: isUserInChat.user.username || isUserInChat.user.name,
      chatId: payload.chatId,
    });
  }

  // Token validation logic
  private async validateToken(client: Socket): Promise<string | null> {
    const authorization = client.handshake.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user.id;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async getUserChats(userId: string): Promise<{ id: string }[]> {
    return this.prisma.chat.findMany({
      where: { participants: { some: { userId } } },
      select: { id: true },
    });
  }

  private getUserIdFromSocketId(socketId: string): string | undefined {
    return [...this.connectedUserSockets.entries()].find(
      ([, id]) => id === socketId,
    )?.[0];
  }

  private async isUserInChat({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) {
    const chatMember = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
      include: { user: true },
    });
    return chatMember;
  }
}
