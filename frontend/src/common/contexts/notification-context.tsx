"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { NSCommon } from "../types";
import useNotificationSocket from "../hooks/use-notification-socket";
import { toast } from "sonner";
import UserAvatar from "@/src/auth/components/user-avatar";
import { getShortRelativeTime } from "../utils/dayjs";
import Image from "next/image";
import Button from "@/components/ui/button";
import { X } from "lucide-react";

const NotificationContext = createContext<{
  notifications: NSCommon.Notification[];
  setNotifications: React.Dispatch<
    React.SetStateAction<NSCommon.Notification[]>
  >;
}>({
  notifications: [],
  setNotifications: () => {},
});

const NotificationContextProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<NSCommon.Notification[]>(
    []
  );

  const { onNewNotification, offNewNotification } = useNotificationSocket();

  useEffect(() => {
    const handleOnNewNotification = (notification: NSCommon.Notification) => {
      const { byUser, type, comment, createdAt, post } = notification;
      const mediaToShow =
        (type === "LIKE" || type === "COMMENT") && post
          ? post?.medias[0]
          : null;

      console.log({ notification });
      setNotifications((not) => [notification, ...not]);

      const id = toast.custom(() => (
        <div className="relative flex gap-x-4 justify-between items-center w-full bg-secondary px-4 py-2 rounded-md">
          <div className="flex gap-x-4 items-center">
            <UserAvatar
              url={byUser.profilePhoto?.url}
              username={byUser.username}
              className="size-10"
            />
            <div>
              <p className="text-sm">
                <b>{byUser.username}</b>&nbsp;
                <span>
                  {type === "LIKE" ? (
                    "liked your post"
                  ) : type === "COMMENT" ? (
                    <>
                      Commented on your post:&nbsp;
                      {comment.content.slice(0, 30)}
                    </>
                  ) : type === "FOLLOW" ? (
                    <>Started following you</>
                  ) : null}
                </span>
              </p>
              <p className="text-sm font-bold text-muted-foreground">
                {getShortRelativeTime(createdAt)}
              </p>
            </div>
          </div>
          {mediaToShow && (
            <div className="size-[40px] min-w-[40px] relative">
              {mediaToShow.mediaType === "IMAGE" ? (
                <Image
                  draggable={false}
                  src={mediaToShow.url}
                  alt="media-file"
                  width={40}
                  height={40}
                  className="rounded-md h-[40px] object-cover object-center"
                />
              ) : (
                <video className="rounded-md full" src={mediaToShow.url} />
              )}
            </div>
          )}
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => toast.dismiss(id)}
            endContent={<X className="size-4" />}
          />
        </div>
      ));
    };
    onNewNotification(handleOnNewNotification);
    return () => {
      offNewNotification(handleOnNewNotification);
    };
  }, [onNewNotification, offNewNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("Please use inside NotificationContextProvider");
  return context;
};

export default NotificationContextProvider;
