"use server";

import { NSCommon } from "@/src/common/types";
import { NSChat } from "../types";
import api from "@/src/common/utils/axios";

export const getChats = async ({
  page,
}: {
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSChat.Chat>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/chats?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const sendMessage = async ({
  chatId,
  message,
}: {
  chatId: string;
  message: string;
}) => {
  try {
    const res = await api.post(`/chats/${chatId}/messages`, { message });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const getChat = async ({
  chatId,
}: {
  chatId: string;
}): NSCommon.Response<NSChat.Chat> => {
  try {
    const res = await api.get(`/chats/${chatId}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const getChatMessages = async ({
  chatId,
  page,
}: {
  page?: number;
  chatId: string;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSChat.Message[]>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/chats/${chatId}/messages?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const createChat = async ({
  name,
  chatType,
  description,
  participantId,
  participantIds,
}: {
  name?: string;
  description?: string;
  participantId?: string;
  participantIds?: string[];
  chatType?: NSChat.ChatType;
}): NSCommon.Response<NSChat.Chat & { existsAlready?: boolean }> => {
  try {
    const res = await api.post(`/chats`, {
      name,
      chatType,
      description,
      participantId,
      participantIds,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
