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
import { MediasService } from 'src/medias/medias.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

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
            role: id === userId ? ChatGroupRole.ADMIN : ChatGroupRole.MEMBER,
            userId: id,
          })),
        },
        createdById: userId,
      },
    });
  }

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.createdById !== userId)
      throw new UnauthorizedException('Only group owner can delete this group');
    return this.prisma.chat.delete({ where: { id: chatId } });
  }

  async getChat(chatId: string) {
    const chat = this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            role: true,
            id: true,
            userId: true,
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
        createdBy: {
          select: {
            username: true,
            name: true,
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
            role: true,
            id: true,
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
        createdBy: {
          select: {
            username: true,
            name: true,
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

  async updateChat(
    userId: string,
    chatId: string,
    { description, name }: UpdateChatDto,
  ) {
    if (!name && !description)
      throw new BadRequestException('One of description or name is required');
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    const myParticipant = chat?.participants.find((p) => p.userId === userId);
    if (!myParticipant)
      throw new UnauthorizedException('You are not part of this chat');

    if (myParticipant.role !== 'ADMIN')
      throw new UnauthorizedException('You are not an Admin');

    const payload: any = {};
    if (name) payload.name = name;
    if (description) payload.description = description;

    const res = await this.prisma.chat.update({
      where: { id: chatId },
      data: payload,
    });
    // group log
    const message = await this.prisma.message.create({
      data: {
        isLog: true,
        chatId,
        text: `Group's ${name && description ? 'Name & Description' : name ? 'Name' : 'Description'} was updated by ${myParticipant.user.name || myParticipant.user.username}`,
        senderId: userId,
      },
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
    });
    return { chat: res, log: message };
  }

  // group chat
  async addParticipantsToChat(
    userId: string,
    chatId: string,
    { participantIds }: AddParticipantDto,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: {
            userId: true,
            role: true,
            user: { select: { name: true, username: true } },
          },
        },
      },
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

    // Filter out participantIds that are already part of the chat
    const participantsToConsider = participantIds.filter((uId) => {
      return !chat.participants.some((p) => p.userId === uId);
    });
    const participantToConsiderUsers = await this.prisma.user.findMany({
      where: {
        id: { in: participantsToConsider },
      },
      select: { name: true, username: true },
      take: 2,
    });

    const res = await this.prisma.chat.update({
      where: { id: chatId },
      data: {
        participants: {
          createMany: {
            data: participantsToConsider.map((participantId) => ({
              userId: participantId,
              role: 'MEMBER',
            })),
          },
        },
      },
    });

    // group
    const message = await this.prisma.message.create({
      data: {
        chatId,
        isLog: true,
        text: `${you.user.name || you.user.username} Added ${participantToConsiderUsers.map((p) => p.name || p.username).join(', ')}${participantIds.length - 2 > 0 ? ` and ${participantIds.length - 2} More` : ''}`,
        senderId: userId,
      },
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
    });
    return { chat: res, log: message };
  }

  async removeParticipantFromChat(
    userId: string,
    chatId: string,
    { participantId }: RemoveParticipantDto,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: {
            id: true,
            userId: true,
            role: true,
            user: { select: { name: true, username: true } },
          },
        },
      },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (chat.type === 'DM') {
      throw new BadRequestException(
        'You cannot remove participants to DM chat',
      );
    }
    const you = chat.participants.find(({ userId: id }) => id === userId);
    if (!you) {
      throw new BadRequestException('You are not a participant of this chat');
    }
    const participant = chat.participants.find((p) => p.id === participantId);
    if (participant?.userId === chat.createdById) {
      throw new BadRequestException(
        userId !== chat.createdById
          ? "You can't remove the owner of the group"
          : "You are owner, hence you can't leave this group",
      );
    }
    if (you.role !== ChatGroupRole.ADMIN && userId !== you.userId) {
      throw new UnauthorizedException('You are not an admin of this chat');
    }

    const res = await this.prisma.chatMember.delete({
      where: { id: participantId },
    });
    // group log
    const participantBeingRemoved = chat.participants.find(
      (p) => p.id === participantId,
    );
    const message = await this.prisma.message.create({
      data: {
        chatId,
        isLog: true,
        text:
          participantId === chat.createdById
            ? `${you.user.name || you.user.username} Left the group`
            : `${you.user.name || you.user.username} Removed ${participantBeingRemoved?.user.name || participantBeingRemoved?.user.username}`,
        senderId: userId,
      },
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
    });
    return { chat: res, log: message };
  }

  async updateParticipant(
    userId: string,
    chatId: string,
    participantId: string,
    { role }: UpdateParticipantDto,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: {
            id: true,
            userId: true,
            role: true,
            user: { select: { name: true, username: true } },
          },
        },
      },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (chat.type === 'DM') {
      throw new BadRequestException(
        'You cannot remove participants from DM chat',
      );
    }
    const you = chat.participants.find(({ userId: id }) => id === userId);
    if (!you) {
      throw new BadRequestException('You are not a participant of this chat');
    }
    if (chat.createdById === participantId) {
      throw new UnauthorizedException("Owner's role can't be changed");
    }
    if (you.role !== ChatGroupRole.ADMIN) {
      throw new UnauthorizedException('You are not an admin of this chat');
    }

    const res = await this.prisma.chatMember.update({
      where: { id: participantId },
      data: { role },
    });
    // group log
    const participantBeingRemoved = chat.participants.find(
      (p) => p.id === participantId,
    );
    const message = await this.prisma.message.create({
      data: {
        chatId,
        isLog: true,
        text: `${you.user.name || you.user.username} Made ${role.toLocaleLowerCase()} to ${participantBeingRemoved?.user.name || participantBeingRemoved?.user.username}`,
        senderId: userId,
      },
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
    });
    return { chat: res, log: message };
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
            status: {
              select: {
                medias: true,
                createdAt: true,
                id: true,
                userId: true,
                user: true,
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
    {
      media,
      message,
      repliedMessageId,
      statusId,
    }: SendMessageDto = {} as SendMessageDto,
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
        ...(statusId ? { statusId, isStatus: true } : {}),
      },
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
        status: {
          select: {
            medias: true,
            createdAt: true,
            id: true,
            userId: true,
            user: true,
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
