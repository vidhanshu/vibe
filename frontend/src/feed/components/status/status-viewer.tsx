"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useSwipe from "@/src/common/hooks/use-swipe";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { getShortNumber } from "@/src/common/utils/number";
import { NSPost } from "@/src/posts/types";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreVertical,
  Pause,
  Play,
  Send,
  Share,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteStatus } from "../../actions/status-action";
import UserChip from "@/src/common/components/user-chip";
import { NSUser } from "@/src/users/types";
import { createChat, sendMessage } from "@/src/chats/actions/chats-action";
import useChatSocket from "@/src/chats/hooks/use-chat-socket";
import { useCopyToClipboard } from "usehooks-ts";

const StatusViewer = ({
  status,
  setViewStatusIdx,
  viewStatusIdx,
  totalStatuses,
}: {
  status: NSPost.Status;
  setViewStatusIdx: React.Dispatch<React.SetStateAction<null | number>>;
  viewStatusIdx: null | number;
  totalStatuses: number;
}) => {
  const qc = useQueryClient();
  const { user } = useSessionStore();
  const userId = user?.id;
  const [mute, setMute] = useState(false);
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const { sendMessage: sSendMessage } = useChatSocket();
  const [isInputFocused, setInputFocused] = useState(false);

  // eslint-disable-next-line
  const [_, cpyText] = useCopyToClipboard();
  const { mutate } = useMutation({
    mutationKey: ["delete-status"],
    mutationFn: async () => {
      const res = await deleteStatus();
      if (res.message) toast.error(res.message);
      else toast.success("Status deleted successfully");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["statuses"] });
      qc.invalidateQueries({ queryKey: ["session"] });
      setViewStatusIdx(null);
    },
  });

  useEffect(() => {
    if (!status?.userId || !userId) return;

    const handleChatCreate = async () => {
      const res = await createChat({
        chatType: "DM",
        participantId: status.userId,
      });
      if (res.data?.id) {
        setChatId(res.data.id);
      } else if (res.message) {
        toast.error(res.message);
      }
    };
    if (status?.userId !== userId) {
      handleChatCreate();
    }
  }, [status?.userId, userId]);

  const { isPending: isSendingMessage, mutate: sendReply } = useMutation({
    mutationKey: ["send-message", chatId],
    mutationFn: async (reaction: string = "") => {
      if (!chatId) return toast.error("Something went wrong!");
      const message = (reaction || inputRef.current?.value) ?? "";
      if (!reaction) {
        if (!message.trim().length) return toast.error("Please enter message");
      }

      const res = await sendMessage({
        chatId,
        message,
        media: null,
        statusId: status.id,
      });
      if (res.message) {
        toast.error(res.message);
        return;
      }
      toast.success(`${reaction ? "Reaction" : "Reply"} sent!`);
      if (inputRef.current) inputRef.current.value = "";
      sSendMessage(res.data);
    },
  });

  const LENGTH = status.medias.length;

  const mediaElements = status.medias.map((media, key) => {
    if (media.mediaType === "IMAGE")
      return (
        <Image
          key={key}
          src={media.url}
          alt="status"
          width={500}
          height={500}
          quality={50}
          draggable={false}
          className={cn("z-10 relative h-full object-contain object-center")}
        />
      );
    return <VideoPreview videoRef={videoRef} key={key} src={media.url} />;
  });

  const handleBack = () => {
    if (active === 0) {
      setViewStatusIdx((prev) => {
        if (prev === null) return prev;
        if (prev === 0) {
          return prev;
        }
        return prev - 1;
      });
      setActive(0);
    } else {
      setActive((prev) => (prev - 1 + LENGTH) % LENGTH);
    }
  };

  const handleNext = () => {
    if (active === LENGTH - 1) {
      setViewStatusIdx((prev) => {
        if (prev === null) return prev;
        if (prev === totalStatuses - 1) {
          return prev;
        }
        return prev + 1;
      });
      setActive(0);
    } else {
      setActive((prev) => (prev + 1) % LENGTH);
    }
  };

  // to reset the active index upon status switches
  useEffect(() => {
    if (viewStatusIdx !== null) {
      setActive(0);
      setMute(false);
    }
  }, [viewStatusIdx]);

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (mute) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
    }
  }, [mute]);

  const swipeProps = useSwipe({
    onSwipedLeft() {
      setViewStatusIdx((prev) => {
        if (prev === null || prev === totalStatuses - 1) return prev;
        return prev + 1;
      });
    },
    onSwipedRight() {
      setViewStatusIdx((prev) => {
        if (prev === null || prev === 0) return prev;
        return prev - 1;
      });
    },
  });

  const toggleMute = () => {
    setMute((e) => !e);
  };

  const isMyStatus = status.userId === user?.id;

  useEffect(() => {
    if (isInputFocused) {
      videoRef.current?.pause();
    }
  }, [isInputFocused]);

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden h-[calc(100vh-90px)] md:h-[calc(100vh-20px)] bg-black"
      )}
      {...swipeProps}
    >
      {status?.medias[active]?.mediaType === "IMAGE" &&
        status?.medias[active].url && (
          <div className="absolute inset-0 blur-lg z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="status"
              src={status.medias[active].url}
              className="h-full w-full"
            />
          </div>
        )}

      {status?.medias[active]?.mediaType === "VIDEO" &&
        status?.medias[active].url && (
          <div className="absolute inset-0 blur-lg z-0 bg-rose-950" />
        )}

      {mediaElements[active]}

      {LENGTH > 1 && (
        <>
          <ChevronLeft
            className="text-black cursor-pointer bg-white rounded-full absolute z-10 inset-y-0 my-auto left-4 p-1 shadow-md"
            onClick={handleBack}
          />
          <ChevronRight
            className="text-black cursor-pointer bg-white rounded-full absolute z-10 inset-y-0 my-auto right-4 p-1 shadow-md"
            onClick={handleNext}
          />
        </>
      )}

      {/* header */}
      <div className="absolute z-10 top-0 space-y-2 inset-x-0 px-4 bg-gradient-to-b from-black/50 via-black/30 to-transparent">
        <div className="flex items-center gap-x-2 mt-2">
          {Array.from({ length: LENGTH }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "flex-1 h-[2px] mt-2 bg-white/70 rounded-full",
                idx <= active ? "bg-white" : ""
              )}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <UserChip user={status.user as NSUser.User} size="sm" />
            <span className="font-normal">
              {getShortRelativeTime(status.createdAt)}
            </span>
            <span className="text-xs">●</span>
            <span className="font-bold text-sm">
              {getShortNumber(status._count.views)} View(s)
            </span>
          </div>

          <div className="flex gap-x-1 items-center">
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete status</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure? This action is irreversible
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => mutate()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    endContent={<MoreVertical className="size-5 fill-white" />}
                    size="icon-sm"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isMyStatus && (
                    <DropdownMenuItem className="text-rose-500">
                      <AlertDialogTrigger>
                        <div>Delete</div>
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      cpyText(
                        `${window.location.href}/users/${status.user.username}?status=open`
                      );
                      toast.success("Link copied");
                    }}
                  >
                    <Share className="size-2" /> Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </AlertDialog>

            {status?.medias?.[active]?.mediaType === "VIDEO" && (
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon-sm"
                endContent={
                  mute ? (
                    <VolumeX className="size-6" />
                  ) : (
                    <Volume2 className="size-6" />
                  )
                }
              />
            )}
            <Button
              className="md:hidden"
              size="icon-sm"
              variant="ghost"
              onClick={() => setViewStatusIdx(null)}
              endContent={<X className="size-5" />}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          isInputFocused ? "" : "hidden",
          "text-white z-10 absolute bottom-24 px-4 inset-x-0"
        )}
      >
        <h1 className="text-center text-2xl font-bold">Quick Reactions</h1>
        <div className="flex justify-between items-center gap-x-2 max-w-[90%] mx-auto mt-4">
          {["😂", "😮", "😍", "👏", "🔥", "💯"].map((e) => (
            <button
              onClick={() => sendReply(e)}
              key={e}
              className="text-4xl md:hover:scale-110 md:transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* footer */}
      {status.userId !== user?.id && (
        <form className="absolute z-10 bottom-0 flex items-center gap-x-2 p-4 inset-x-0">
          <Input
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={isSendingMessage}
            ref={inputRef}
            className="bg-transparent border-white text-white rounded-full placeholder:text-white focus-visible:ring-0"
            placeholder={
              isSendingMessage
                ? "Sending reply..."
                : `Reply to ${status.user.username}...`
            }
          />
          <Heart className="size-7" />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              sendReply(undefined);
            }}
            className="disabled:text-muted-foreground"
          >
            <Send className="size-7 cursor-pointer" />
          </button>
        </form>
      )}
    </div>
  );
};

export default StatusViewer;

const VideoPreview = React.memo(
  ({
    src,
    videoClassName,
    videoRef,
  }: {
    src: string;
    videoClassName?: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
  }) => {
    const [play, setPlay] = useState(false);
    const [visible, setVisible] = useState(true);

    React.useEffect(() => {
      if (play) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
    }, [play, videoRef]);

    const togglePlay = () => {
      setPlay((e) => !e);
      setVisible(true);
      if (!play) {
        setTimeout(() => setVisible(false), 1000);
      }
    };

    return (
      <div className="relative h-full md:h-[calc(100vh-20px)]">
        <div className="relative h-full" onClick={togglePlay}>
          <video
            loop
            src={src}
            ref={videoRef}
            controls={false}
            className={cn(
              "object-contain object-center h-full w-full",
              videoClassName
            )}
          />
          <button
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-opacity",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            {play ? (
              <Pause className="size-12 fill-white" />
            ) : (
              <Play className="size-12 fill-white" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";
