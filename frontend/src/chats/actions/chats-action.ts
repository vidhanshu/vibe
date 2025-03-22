"use server";

import { NSCommon } from "@/src/common/types";
import { NSChat } from "../types";
import api from "@/src/common/utils/axios";
import { deleteFiles, uploadFiles } from "@/src/common/actions/file-actions";
import { NSAuth } from "@/src/auth/types";

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
  media,
}: {
  chatId: string;
  message?: string;
  media: File | null;
}) => {
  let uploadedFiles: Omit<NSAuth.Media, "id">[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: Record<string, any> = { message };
    if (media) {
      const res = await uploadFiles([media]);
      if (res.message) {
        return { message: res.message, data: null };
      }
      uploadedFiles = res.data ?? [];
    }
    if (uploadedFiles.length) {
      payload["media"] = uploadedFiles[0];
    }
    const res = await api.post(`/chats/${chatId}/messages`, payload);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // delete uploaded files, if error
    if (uploadedFiles.length)
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    return { message: error.message, data: null };
  }
};

export const unSendMessage = async ({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: string;
}) => {
  try {
    const res = await api.delete(`/chats/${chatId}/messages/${messageId}`);
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
