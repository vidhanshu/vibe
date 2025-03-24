"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import io, { type Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getAuthTokenSA } from "../actions/get-token";
import { NSChat } from "@/src/chats/types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isLoading: boolean;
  // Chat specific methods
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  // Event listeners
  onNewMessage: (callback: (message: NSChat.Message) => void) => void;
  offNewMessage: (callback: (message: NSChat.Message) => void) => void;
  onSendMessage: (message: NSChat.Message) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isLoading: false,
  joinChat: () => {},
  leaveChat: () => {},
  onNewMessage: () => {},
  offNewMessage: () => {},
  onSendMessage: () => {},
});

export const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { isLoading, data } = useQuery({
    queryKey: ["auth-token"],
    queryFn: async () => {
      const res = await getAuthTokenSA();
      if (!res) return null;
      return res;
    },
  });

  useEffect(() => {
    if (!data) return;

    setSocketInstance(
      io(SOCKET_URL, {
        extraHeaders: {
          authorization: `Bearer ${data}`,
        },
      })
    );
  }, [data]);

  useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.close();
    };
  }, [socketInstance]);

  const joinChat = useCallback(
    (chatId: string) => {
      if (!socketInstance) return;
      socketInstance.emit("join_chat", { chatId });
    },
    [socketInstance]
  );

  const leaveChat = useCallback(
    (chatId: string) => {
      if (!socketInstance) return;
      socketInstance.emit("leave_chat", { chatId });
    },
    [socketInstance]
  );

  const onNewMessage = useCallback(
    (callback: (message: NSChat.Message) => void) => {
      if (!socketInstance) return;
      socketInstance.on("receiveMessage", callback);
    },
    [socketInstance]
  );

  const offNewMessage = useCallback(
    (callback: (message: NSChat.Message) => void) => {
      if (!socketInstance) return;
      socketInstance.off("receiveMessage", callback);
    },
    [socketInstance]
  );

  const onSendMessage = useCallback(
    (message: NSChat.Message) => {
      if (!socketInstance) return;
      socketInstance.emit("sendMessage", message);
    },
    [socketInstance]
  );

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        isConnected,
        isLoading,
        joinChat,
        leaveChat,
        onNewMessage,
        offNewMessage,
        onSendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
