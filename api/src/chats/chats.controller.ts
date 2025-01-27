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
import { AddParticipantDto } from './dto/add-participant.dto';

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

  @Get(':id/messages')
  getChatMessages(
    @Param('id') chatId: string,
    @Query() filterMessagesDto: FilterMessagesDto,
    @User('sub') userId: string,
  ) {
    return this.chatsService.getChatMessages(userId, chatId, filterMessagesDto);
  }

  @Get(':id/add-participant')
  addParticipantToChat(
    @Param('id') chatId: string,
    @User('sub') userId: string,
    @Body() addParticipantDto: AddParticipantDto,
  ) {
    return this.chatsService.addParticipantToChat(
      userId,
      chatId,
      addParticipantDto,
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
