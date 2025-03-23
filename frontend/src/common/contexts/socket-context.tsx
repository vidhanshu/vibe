"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { type Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getAuthTokenSA } from "../actions/get-token";

const SocketContext = createContext<{
  socket: Socket | null;
  isConnected: boolean;
  isLoading: boolean;
}>({
  socket: null,
  isConnected: false,
  isLoading: false,
});

export const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { isLoading, data } = useQuery({
    queryKey: ["auth-token"],
    queryFn: async () => {
      const res = getAuthTokenSA();
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

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        isConnected,
        isLoading,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
