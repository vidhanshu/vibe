import { useSocketContext } from "@/src/common/contexts/socket-context";
import { SOCKET_EVENTS } from "@/src/common/utils/constants";
import { useCallback } from "react";
import { NSCommon } from "../types";

const useNotificationSocket = () => {
  const { socket: socketInstance } = useSocketContext();

  const onNewNotification = useCallback(
    (callback: (message: NSCommon.Notification) => void) => {
      if (!socketInstance) return;
      socketInstance.on(SOCKET_EVENTS.RECEIVE_NOTIFICATION, callback);
    },
    [socketInstance]
  );

  const offNewNotification = useCallback(
    (callback: (message: NSCommon.Notification) => void) => {
      if (!socketInstance) return;
      socketInstance.off(SOCKET_EVENTS.RECEIVE_NOTIFICATION, callback);
    },
    [socketInstance]
  );

  return {
    onNewNotification,
    offNewNotification,
  };
};

export default useNotificationSocket;
