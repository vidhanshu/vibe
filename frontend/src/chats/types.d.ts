import { NSCommon } from "../common/types";
import { NSUser } from "../users/types";

export namespace NSChat {
  export interface Chat {
    id: string;
    type: ChatType;

    // group only
    name?: string;
    description?: string;
    createdBy?: NSUser.User;
    createdById?: string;

    participants: ChatMember[];
    messages: Message[];

    createdAt: Date;
    updatedAt: Date;
    _count: { participants: number };
  }

  export type ChatType = "DM" | "GROUP";
  export type ChatGroupRole = "ADMIN" | "MEMBER";

  export interface ChatMember {
    id: string;
    chatId: string;
    userId: string;
    chat: Chat;
    user: NSUser.User;
    joinedAt: Date;
    leftAt?: Date;
    role: ChatGroupRole;
  }

  export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text?: string;
    media?: NSCommon.Media;
    chat: Chat;
    repliedToMessage?: Message;
    repliedToMessageId?: string;
    sender: NSUser.User;
    createdAt: Date;
    updatedAt: Date;
    isLog: boolean;
  }
}
