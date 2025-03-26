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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const sendMessage = async ({
  chatId,
  message,
  media,
  repliedMessageId,
  statusId,
}: {
  chatId: string;
  message?: string;
  media: File | null;
  repliedMessageId?: string;
  statusId?: string;
}) => {
  let uploadedFiles: Omit<NSAuth.Media, "id">[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = { message };
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
    if (repliedMessageId) {
      payload["repliedMessageId"] = repliedMessageId;
    }
    if (statusId) {
      payload["statusId"] = statusId;
    }
    const res = await api.post(`/chats/${chatId}/messages`, payload);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // delete uploaded files, if error
    if (uploadedFiles.length)
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const updateMessage = async ({
  message,
  messageId,
}: {
  messageId: string;
  message: string;
}): NSCommon.Response<NSChat.Message> => {
  try {
    const res = await api.patch(`/chats/messages/${messageId}`, { message });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const updateChat = async ({
  name,
  chatId,
  description,
}: {
  chatId: string;
  name?: string;
  description?: string;
}): NSCommon.Response<{
  chat: NSChat.Chat & { existsAlready?: boolean };
  log: NSChat.Message;
}> => {
  try {
    const res = await api.patch(`/chats/${chatId}`, {
      name,
      description,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const deleteChat = async ({
  chatId,
}: {
  chatId: string;
}): NSCommon.Response<null> => {
  try {
    const res = await api.delete(`/chats/${chatId}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const addParticipants = async ({
  chatId,
  participantIds,
}: {
  chatId: string;
  participantIds: string[];
}): NSCommon.Response<{ chat: NSChat.Chat; log: NSChat.Message }> => {
  try {
    const res = await api.patch(`/chats/${chatId}/add-participants`, {
      participantIds,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const removeParticipant = async ({
  chatId,
  participantId,
}: {
  chatId: string;
  participantId: string;
}): NSCommon.Response<{ chat: NSChat.Chat; log: NSChat.Message }> => {
  try {
    const res = await api.patch(`/chats/${chatId}/remove-participant`, {
      participantId,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const updateParticipant = async ({
  chatId,
  participantId,
  role,
}: {
  chatId: string;
  participantId: string;
  role: NSChat.ChatGroupRole;
}): NSCommon.Response<{ chat: NSChat.Chat; log: NSChat.Message }> => {
  try {
    const res = await api.patch(
      `/chats/${chatId}/participant/${participantId}`,
      { role }
    );
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};
