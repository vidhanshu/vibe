"use client";

import useInfinite from "@/src/common/hooks/use-infinite";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useMemo, useState, useRef } from "react";
import { getChat, getChatMessages, sendMessage } from "../actions/chats-action";
import { Skeleton } from "@/components/ui/skeleton";
import useSessionStore from "@/src/common/stores/session-store";
import UserChip from "@/src/common/components/user-chip";
import GroupChip from "./group-chip";
import EmojiPicker from "@/src/common/components/popovers/emoji-picker";
import Button from "@/components/ui/button";
import { Image, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NSChat } from "../types";
import UserAvatar from "@/src/auth/components/user-avatar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import dayjs from "dayjs";

// Chat Header Component
const ChatHeader = ({
  chat,
  isLoading,
  userId,
}: {
  chat: NSChat.Chat | undefined;
  isLoading: boolean;
  userId: string;
}) => {
  const otherParticipant = chat?.participants.find((p) => p.user.id !== userId);
  const chatType = chat?.type;

  return (
    <div className="px-4 border-b h-[65px] flex items-center">
      {chat && (
        <>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          ) : chatType === "DM" ? (
            <UserChip user={otherParticipant?.user!} />
          ) : (
            <GroupChip
              title={chat?.name ?? "Unknown Group"}
              participants={chat?.participants ?? []}
            />
          )}
        </>
      )}
    </div>
  );
};

const Message = ({
  message,
  isMyMessage,
  total,
  index,
}: {
  message: NSChat.Message;
  isMyMessage: boolean;
  total: number;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "px-3 py-1 bg-secondary w-fit rounded-sm",
        {
          "bg-[#3697ef] text-white ml-auto rounded-l-3xl": isMyMessage,
          "rounded-r-3xl": !isMyMessage,
        },
        total === 1
          ? "rounded-3xl"
          : total === 2
          ? isMyMessage
            ? index == 1
              ? "rounded-t-3xl"
              : "rounded-b-3xl"
            : index == 1
            ? "rounded-t-3xl rounded-r-3xl"
            : "rounded-b-3xl rounded-r-3xl"
          : isMyMessage
          ? index == total - 1
            ? "rounded-t-3xl"
            : index === 0
            ? "rounded-b-3xl"
            : ""
          : index == total - 1
          ? "rounded-t-3xl rounded-r-3xl"
          : index === 0
          ? "rounded-b-3xl rounded-r-3xl"
          : ""
      )}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: message.text?.replaceAll("\n", "<br/>") || "",
        }}
      />
      <div className={cn("text-[.6rem] text-right")}>
        {dayjs(message.createdAt).format("hh:mm a")}
      </div>
    </div>
  );
};

const MessageGroup = ({
  messages,
  userId,
}: {
  messages: NSChat.Message[];
  userId: string;
}) => {
  const sender = messages[0].sender;
  const total = messages.length;

  return (
    <div
      className={cn("flex max-w-[70%] gap-x-4", {
        "self-end flex-row-reverse": sender.id === userId,
      })}
    >
      <Link href={`/users/${sender.username}`}>
        <UserAvatar username={sender.username} url={sender.profilePhoto?.url} />
      </Link>
      <div className="flex flex-col-reverse gap-y-1">
        {messages.map((message, idx) => (
          <Message
            key={message.id}
            message={message}
            isMyMessage={message.senderId === userId}
            total={total}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};

// User Profile Info Component
const UserProfileInfo = ({
  chat,
  otherParticipant,
}: {
  chat: NSChat.Chat | undefined;
  otherParticipant: NSChat.ChatMember | undefined;
}) => {
  return (
    <div className="py-4 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        {chat?.type === "DM" ? (
          <UserChip
            user={otherParticipant?.user!}
            avatarOnly
            noLink
            size="2xl"
          />
        ) : (
          <GroupChip
            participants={chat?.participants || []}
            title=""
            size="2xl"
          />
        )}
        <div>
          <p className="font-bold text-xl text-center">
            {chat?.type === "DM"
              ? otherParticipant?.user?.username
              : chat?.name}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            {otherParticipant?.user?.name}
          </p>
          {chat?.type === "GROUP" && chat?.description && (
            <p className="text-xs text-muted-foreground text-center">
              {chat?.description}
            </p>
          )}
        </div>
      </div>
      {chat?.type === "DM" && (
        <Link href={`/users/${otherParticipant?.user?.username}`}>
          <Button size="sm" className="font-bold">
            View profile
          </Button>
        </Link>
      )}
    </div>
  );
};

const MessageInput = ({
  message,
  setMessage,
  isSendingMessage,
  onSend,
}: {
  message: string;
  setMessage: (value: string) => void;
  isSendingMessage: boolean;
  onSend: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-x-2 border px-3 py-1.5 rounded-3xl w-full">
        <EmojiPicker
          onEmojiClick={(emoji: string) => setMessage(message + emoji)}
        >
          {({ open, setOpen }) => (
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="min-w-9"
              onClick={() => setOpen((p) => !p)}
            >
              <Smile className={cn("size-4", open && "text-blue-500")} />
            </Button>
          )}
        </EmojiPicker>
        <Textarea
          ref={textareaRef}
          rows={1}
          value={message}
          placeholder="Enter message..."
          onChange={(e) => {
            const target = e.target;
            target.style.height = "22px";
            target.style.height = `${target.scrollHeight}px`;
            setMessage(target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim().length) {
                onSend();
              }
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "22px";
            target.style.height = `${target.scrollHeight}px`;
          }}
          className="border-none focus-visible:ring-0 flex-1 text-base p-0 overflow-y-auto min-h-[22px] max-h-[120px] resize-none"
        />
        {message.trim().length ? (
          <button onClick={onSend} className="text-blue-500 font-bold text-sm">
            Send
          </button>
        ) : (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="min-w-9"
            loading={isSendingMessage}
          >
            <Image className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const ChatMessages = () => {
  const params = useParams();
  const userId = useSessionStore((s) => s.user?.id);
  const chatId = params.chatId as string;
  const [message, setMessage] = useState("");

  const { isPending: isSendingMessage, mutate } = useMutation({
    mutationKey: ["send-message", chatId],
    mutationFn: async () => {
      if (!message.trim().length) return toast.error("Please enter message");
      const res = await sendMessage({
        chatId,
        message,
      });
      if (res.message) return toast.error(res.message);
      setMessage("");
    },
  });

  const { data: chat, isLoading: isChatLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChat({ chatId });
      return res.data;
    },
    enabled: !!chatId,
  });

  const { data, hasNextPage, isFetchingNextPage, isLoading, ref, status } =
    useInfinite({
      queryKey: ["chat-messages", chatId],
      fetcher: async (props: any) => getChatMessages({ chatId, ...props }),
    });

  const otherParticipant = chat?.participants.find((p) => p.user.id !== userId);

  const allMessages = useMemo(() => {
    const allMessages = data
      ?.map((data) => data.items)
      .flat() as NSChat.Message[];
    if (!allMessages?.length) return [];

    const messageGroups: NSChat.Message[][] = [];
    let currentGroup: NSChat.Message[] = [];

    allMessages.forEach((message, index) => {
      if (index === 0) {
        currentGroup.push(message);
      } else {
        const prevMessage = allMessages[index - 1];
        if (prevMessage.senderId === message.senderId) {
          currentGroup.push(message);
        } else {
          if (currentGroup.length) {
            messageGroups.push([...currentGroup]);
          }
          currentGroup = [message];
        }
      }
    });

    if (currentGroup.length) {
      messageGroups.push(currentGroup);
    }

    return messageGroups;
  }, [data]);

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        chat={chat || undefined}
        isLoading={isChatLoading}
        userId={userId!}
      />

      <div
        className={cn("flex-1 max-h-[calc(100vh-65px-70px)] overflow-y-auto")}
      >
        <div>
          <div className="min-h-[calc(100vh-65px-70px)] flex flex-col-reverse p-4 gap-2">
            {allMessages.map((messages, idx) => (
              <MessageGroup key={idx} messages={messages} userId={userId!} />
            ))}
            <UserProfileInfo
              chat={chat || undefined}
              otherParticipant={otherParticipant}
            />
            <div ref={ref} />
          </div>
        </div>
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        isSendingMessage={isSendingMessage}
        onSend={() => mutate()}
      />
    </div>
  );
};

export default ChatMessages;
