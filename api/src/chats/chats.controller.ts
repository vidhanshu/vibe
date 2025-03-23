import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/common/decorators/user.decorator';
import { FilterChatsDto } from './dto/filter-chats.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { FilterMessagesDto } from './dto/filter-messages.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  getChats(
    @Query() filterChatsDto: FilterChatsDto,
    @User('sub') userId: string,
  ) {
    return this.chatsService.getChats(userId, filterChatsDto);
  }

  @Patch(':id')
  updateChat(
    @User('sub') userId: string,
    @Param('id') chatId: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatsService.updateChat(userId, chatId, updateChatDto);
  }

  @Delete(':id')
  deleteChat(@User('sub') userId: string, @Param('id') chatId: string) {
    return this.chatsService.deleteChat(userId, chatId);
  }

  @Get(':id')
  getChat(@User('sub') userId: string, @Param('id') chatId: string) {
    return this.chatsService.getChat(chatId);
  }

  @Post()
  createChat(@Body() createChatDto: CreateChatDto, @User('sub') id: string) {
    return this.chatsService.createChat(id, createChatDto);
  }

  @Post(':id/messages')
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param('id') chatId: string,
    @User('sub') userId: string,
  ) {
    return this.chatsService.sendMessage(userId, chatId, sendMessageDto);
  }
  @Patch('/messages/:messageId')
  updateMessage(
    @Body() updateMessageDto: UpdateMessageDto,
    @Param('messageId') messageId: string,
    @User('sub') userId: string,
  ) {
    return this.chatsService.updateMessage(userId, messageId, updateMessageDto);
  }

  @Get(':id/messages')
  getChatMessages(
    @Param('id') chatId: string,
    @Query() filterMessagesDto: FilterMessagesDto,
    @User('sub') userId: string,
  ) {
    return this.chatsService.getChatMessages(userId, chatId, filterMessagesDto);
  }

  @Patch(':id/add-participants')
  addParticipantsToChat(
    @Param('id') chatId: string,
    @User('sub') userId: string,
    @Body() addParticipantDto: AddParticipantDto,
  ) {
    return this.chatsService.addParticipantsToChat(
      userId,
      chatId,
      addParticipantDto,
    );
  }

  @Patch(':id/remove-participant')
  removeParticipantFromChat(
    @Param('id') chatId: string,
    @User('sub') userId: string,
    @Body() removeParticipantDto: RemoveParticipantDto,
  ) {
    return this.chatsService.removeParticipantFromChat(
      userId,
      chatId,
      removeParticipantDto,
    );
  }

  @Patch(':id/participant/:participantId')
  updateParticipant(
    @Param('id') chatId: string,
    @Param('participantId') participantId: string,
    @User('sub') userId: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.chatsService.updateParticipant(
      userId,
      chatId,
      participantId,
      updateParticipantDto,
    );
  }

  @Delete(':id/messages/:messageId')
  deleteMessage(
    @Param('messageId') messageId: string,
    @User('sub') userId: string,
  ) {
    return this.chatsService.deleteMessage(userId, messageId);
  }
}
