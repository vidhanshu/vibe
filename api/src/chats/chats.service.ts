import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chat, ChatGroupRole, ChatType, Message, Prisma } from '@prisma/client';
import { FilterChatsDto } from './dto/filter-chats.dto';
import { PaginatedResponse } from 'src/common/types/return-type';
import { SendMessageDto } from './dto/send-message.dto';
import { FilterMessagesDto } from './dto/filter-messages.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { MediasService } from 'src/medias/medias.service';
import { UpdateMessageDto } from './dto/update-message-dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediasService,
  ) {}

  // chat
  async createChat(
    userId: string,
    {
      chatType,
      description,
      name,
      participantId,
      participantIds,
    }: CreateChatDto,
  ) {
    if (chatType === ChatType.DM) {
      // TODO: add self dm support
      if (userId == participantId) {
        throw new BadRequestException('You cannot DM yourself');
      }

      const existingChat = await this.prisma.chat.findFirst({
        where: {
          type: ChatType.DM,
          participants: {
            every: { userId: { in: [participantId, userId] } },
            some: { userId },
          },
        },
      });
      if (existingChat) {
        return { ...existingChat, existsAlready: true };
      }

      return this.prisma.chat.create({
        data: {
          type: chatType,
          participants: {
            create: [
              {
                userId,
                role: ChatGroupRole.MEMBER,
              },
              {
                userId: participantId,
                role: ChatGroupRole.MEMBER,
              },
            ],
          },
        },
      });
    }

    // Group
    const participants = [...new Set([...participantIds, userId])];
    if (participants.length < 2) {
      throw new BadRequestException(
        'At least 2 participants are required (including you)',
      );
    }

    return this.prisma.chat.create({
      data: {
        name,
        description,
        type: chatType,
        participants: {
          create: participants.map((id) => ({
            role: id === userId ? ChatGroupRole.ADMIN : ChatGroupRole.ADMIN,
            userId: id,
          })),
        },
      },
    });
  }

  async getChat(chatId: string): Promise<Chat | null> {
    const chat = this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: {
            user: {
              select: {
                profilePhoto: true,
                username: true,
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true,
                id: true,
                profilePhoto: true,
              },
            },
            media: true,
          },
        },
      },
    });
    if (!chat) throw new NotFoundException('Chat not found!');
    return chat;
  }

  async getChats(
    userId: string,
    { chatType, limit = 20, page = 1, search }: FilterChatsDto,
  ): Promise<PaginatedResponse<Chat>> {
    const skip = (page - 1) * limit;
    const filter: Prisma.ChatFindManyArgs = {
      skip,
      take: limit,
      include: {
        participants: {
          select: {
            user: {
              select: {
                profilePhoto: true,
                username: true,
                id: true,
                name: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true,
                id: true,
                profilePhoto: true,
              },
            },
            media: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      where: {
        participants: {
          some: { userId },
        },
      },
    };

    if (chatType) {
      if (filter.where) filter.where.type = chatType;
    }
    if (search) {
      if (filter.where) {
        filter.where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [chats, count] = await Promise.all([
      this.prisma.chat.findMany(filter),
      this.prisma.chat.count({
        where: filter.where,
      }),
    ]);

    return {
      items: chats,
      metadata: {
        limit,
        currentPage: page,
        totalItems: count,
        itemsCount: chats.length,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // group chat
  async addParticipantToChat(
    userId: string,
    chatId: string,
    addParticipantDto: AddParticipantDto,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: { select: { userId: true, role: true } } },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (chat.type === 'DM') {
      throw new BadRequestException('You cannot add participants to DM chat');
    }
    const you = chat.participants.find(({ userId: id }) => id === userId);
    if (!you) {
      throw new BadRequestException('You are not a participant of this chat');
    }
    if (you.role !== ChatGroupRole.ADMIN) {
      throw new UnauthorizedException('You are not an admin of this chat');
    }
    const participantAlreadyMember = chat.participants.find(
      ({ userId: id }) => id === addParticipantDto.participantId,
    );
    if (participantAlreadyMember) {
      throw new BadRequestException('Participant is already a member');
    }

    const participant = await this.prisma.user.findUnique({
      where: { id: addParticipantDto.participantId },
    });
    if (!participant) {
      throw new BadRequestException('Participant not found');
    }

    return this.prisma.chat.update({
      where: { id: chatId },
      data: {
        participants: {
          create: { userId: addParticipantDto.participantId, role: 'MEMBER' },
        },
      },
    });
  }

  // messages
  async getChatMessages(
    userId: string,
    chatId: string,
    { limit = 50, page = 1 }: FilterMessagesDto,
  ): Promise<PaginatedResponse<Message>> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: { select: { userId: true } } },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (!chat.participants.map(({ userId }) => userId).includes(userId)) {
      throw new BadRequestException('You are not a participant of this chat');
    }

    // we are sure that the user is a participant
    const skip = (page - 1) * limit;
    const messages = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          skip,
          take: limit,
          include: {
            media: true,
            sender: {
              select: {
                username: true,
                id: true,
                name: true,
                profilePhoto: true,
              },
            },
            repliedToMessage: {
              select: {
                id: true,
                text: true,
                senderId: true,
                sender: {
                  select: { id: true, username: true, name: true },
                },
                media: {
                  select: {
                    id: true,
                    key: true,
                    url: true,
                    mediaType: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return {
      items: messages?.messages ?? [],
      metadata: {
        limit,
        currentPage: page,
        totalItems: messages?._count.messages ?? 0,
        itemsCount: messages?.messages.length ?? 0,
        totalPages: Math.ceil((messages?._count.messages ?? 0) / limit),
      },
    };
  }

  async sendMessage(
    userId: string,
    chatId: string,
    { media, message, repliedMessageId }: SendMessageDto = {} as SendMessageDto,
  ) {
    if (!media && !message) {
      throw new BadRequestException('message or media is required');
    }
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: { select: { userId: true } } },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (!chat.participants.map(({ userId }) => userId).includes(userId)) {
      throw new BadRequestException('You are not a participant of this chat');
    }

    // update the chat's last updated at to sort it up
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return this.prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text: message,
        media: media ? { create: media } : undefined,
        ...(repliedMessageId ? { repliedToMessageId: repliedMessageId } : {}),
      },
    });
  }

  async updateMessage(
    userId: string,
    messageId: string,
    { message }: UpdateMessageDto = {} as UpdateMessageDto,
  ) {
    if (!message) {
      throw new BadRequestException('message is required');
    }
    const messageInstance = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!messageInstance) throw new NotFoundException('Message not found');
    if (messageInstance.senderId !== userId)
      throw new UnauthorizedException(
        'You are not allowed to delete this message',
      );

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        text: message,
      },
    });
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { media: { select: { key: true } } },
    });
    if (!message) {
      throw new BadRequestException('Message not found');
    }
    if (message.senderId !== userId) {
      throw new UnauthorizedException();
    }
    if (message.media?.key) {
      await this.mediaService.deleteFiles([message.media.key]);
    }
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
