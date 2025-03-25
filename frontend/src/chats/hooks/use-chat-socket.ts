import { useSocketContext } from "@/src/common/contexts/socket-context";
import { useCallback } from "react";
import { NSChat } from "../types";
import { SOCKET_EVENTS } from "@/src/common/utils/constants";

export type SocketOnRemoveMessagePayload = {
  chatId: string;
  messageId: string;
};
export type SocketOnUpdateMessagePayload = {
  chatId: string;
  message: NSChat.Message;
};
export type SocketOnTypingResponse = {
  chatId: string;
  userId: string;
  name: string;
};
const useChatSocket = () => {
  const { socket: socketInstance } = useSocketContext();

  const joinChat = useCallback(
    (chatId: string) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId });
    },
    [socketInstance]
  );

  const leaveChat = useCallback(
    (chatId: string) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId });
    },
    [socketInstance]
  );

  const onNewMessage = useCallback(
    (callback: (message: NSChat.Message) => void) => {
      if (!socketInstance) return;
      console.log("[receiveMessage]");
      socketInstance.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    },
    [socketInstance]
  );

  const offNewMessage = useCallback(
    (callback: (message: NSChat.Message) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    },
    [socketInstance]
  );

  const onUpdateMessage = useCallback(
    (callback: (payload: SocketOnUpdateMessagePayload) => void) => {
      if (!socketInstance) return;
      console.log("[updateMessage]");
      socketInstance.on(SOCKET_EVENTS.RECEIVE_UPDATED_MESSAGE, callback);
    },
    [socketInstance]
  );

  const offUpdateMessage = useCallback(
    (callback: (message: SocketOnUpdateMessagePayload) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.RECEIVE_UPDATED_MESSAGE, callback);
    },
    [socketInstance]
  );

  const onRemoveMessage = useCallback(
    (callback: (payload: SocketOnRemoveMessagePayload) => void) => {
      if (!socketInstance) return;
      socketInstance.on(SOCKET_EVENTS.REMOVE_MESSAGE, callback);
    },
    [socketInstance]
  );

  const offRemoveMessage = useCallback(
    (callback: (payload: SocketOnRemoveMessagePayload) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.REMOVE_MESSAGE, callback);
    },
    [socketInstance]
  );

  const onTypingMessage = useCallback(
    (callback: (payload: SocketOnTypingResponse) => void) => {
      if (!socketInstance) return;
      socketInstance.on(SOCKET_EVENTS.TYPING, (p) => {
        callback(p);
      });
    },
    [socketInstance]
  );

  const offTypingMessage = useCallback(
    (callback: (payload: SocketOnTypingResponse) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.TYPING, callback);
    },
    [socketInstance]
  );

  const onStopTypingMessage = useCallback(
    (callback: (payload: SocketOnTypingResponse) => void) => {
      if (!socketInstance) return;
      socketInstance.on(SOCKET_EVENTS.STOP_TYPING, (p) => {
        callback(p);
      });
    },
    [socketInstance]
  );

  const offStopTypingMessage = useCallback(
    (callback: (payload: SocketOnTypingResponse) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.STOP_TYPING, callback);
    },
    [socketInstance]
  );
  const onChatListUpdate = useCallback(
    (callback: (payload: NSChat.Chat) => void) => {
      if (!socketInstance) return;
      socketInstance.on(SOCKET_EVENTS.UPDATE_CHAT_LIST, (p) => {
        callback(p);
      });
    },
    [socketInstance]
  );

  const offChatListUpdate = useCallback(
    (callback: (payload: NSChat.Chat) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.UPDATE_CHAT_LIST, callback);
    },
    [socketInstance]
  );

  const sendMessage = useCallback(
    (payload: NSChat.Message) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
    },
    [socketInstance]
  );
  const startTyping = useCallback(
    (payload: { chatId: string }) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.TYPING, payload);
    },
    [socketInstance]
  );
  const stopTyping = useCallback(
    (payload: { chatId: string }) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.STOP_TYPING, payload);
    },
    [socketInstance]
  );

  const unSendMessage = useCallback(
    (payload: SocketOnRemoveMessagePayload) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.UNSEND_MESSAGE, payload);
    },
    [socketInstance]
  );

  const updateMessage = useCallback(
    (payload: SocketOnUpdateMessagePayload) => {
      if (!socketInstance) return;
      socketInstance.emit(SOCKET_EVENTS.UPDATE_MESSAGE, payload);
    },
    [socketInstance]
  );

  return {
    joinChat,
    leaveChat,
    onNewMessage,
    offNewMessage,
    sendMessage,
    unSendMessage,
    offRemoveMessage,
    onRemoveMessage,
    startTyping,
    stopTyping,
    onTypingMessage,
    offTypingMessage,
    onStopTypingMessage,
    offStopTypingMessage,
    updateMessage,
    onUpdateMessage,
    offUpdateMessage,
    onChatListUpdate,
    offChatListUpdate,
  };
};

export default useChatSocket;
