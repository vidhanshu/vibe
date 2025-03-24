"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useSessionStore from "@/src/common/stores/session-store";
import Button from "@/components/ui/button";
import { Loader2, MessageCircleOff } from "lucide-react";
import { cn } from "@/lib/utils";
import NoContent from "@/src/users/components/no-content";
import ChatUsersModal from "./chat-users-modal";
import ChatHeader from "./chat-header";
import ChatProfileInfo from "./chat-profile-info";
import MessageInput from "./chat-message-input";
import MessageGroup from "./message-group";
import useChatMessages from "../hooks/use-chat-messages";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ChatActionSidebar from "./chat-action-sidebar";
import { NSChat } from "../types";
import { useParams } from "next/navigation";
import { getChat } from "../actions/chats-action";
import { useQuery } from "@tanstack/react-query";

const DateSeparator = ({ date }: { date: string }) => {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  let displayDate = "";
  if (date === today) {
    displayDate = "Today";
  } else if (date === yesterday) {
    displayDate = "Yesterday";
  } else {
    displayDate = dayjs(date).format("DD/MM/YYYY");
  }

  return (
    <div className="flex items-center justify-center my-4">
      <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
        {displayDate}
      </div>
    </div>
  );
};

const ChatMessages = () => {
  const params = useParams();
  const chatId = params.chatId as string;

  const userId = useSessionStore((s) => s.user?.id);

  const [chatInfoOpen, setChatInfoOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<null | string>(null);
  const [replyMessage, setReplyMessage] = useState<NSChat.Message | null>(null);
  const {
    allMessages,
    scrollContainerRef,
    isFetchingNextPage,
    hasNextPage,
    isMessagesLoading,
    fetchNextPage,
    prevScrollHeight,
    audioContent,
  } = useChatMessages();

  const { data: chat, isLoading: isChatLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChat({ chatId });
      return res.data;
    },
    enabled: !!chatId,
  });

  const myParticipant = chat?.participants?.find((p) => p.userId === userId);
  const otherParticipant = useMemo(
    () => chat?.participants?.find((p) => p.user.id !== userId),
    [chat, userId]
  );

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (el.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      prevScrollHeight.current = el.scrollHeight;
      fetchNextPage();
    }
  };

  return (
    <div className="h-screen flex">
      {audioContent}
      <div
        className={cn(
          "h-screen flex flex-col flex-1",
          (!chat || (chat?.type === "GROUP" && !myParticipant)) &&
            "items-center justify-center"
        )}
      >
        {!chat && !isChatLoading ? (
          <div>
            <div className="flex flex-col items-center gap-4">
              <NoContent
                icon={MessageCircleOff}
                iconClassName="size-12 stroke-1"
                iconContainerClassName="size-20"
                title="No chat found"
                subtitle="Please click on below send message button and select user to chat"
              />
              <ChatUsersModal>
                <Button variant="info" className="w-fit font-bold" size="xs">
                  Send message
                </Button>
              </ChatUsersModal>
            </div>
          </div>
        ) : chat?.type === "GROUP" && !myParticipant && !isChatLoading ? (
          <div className="flex flex-col items-center gap-4">
            <NoContent
              icon={MessageCircleOff}
              iconClassName="size-12 stroke-1"
              iconContainerClassName="size-20"
              title="No chat found"
              subtitle="Please click on below send message button and select user to chat"
            />
            <ChatUsersModal>
              <Button variant="info" className="w-fit font-bold" size="xs">
                Send message
              </Button>
            </ChatUsersModal>
          </div>
        ) : (
          <>
            <ChatHeader
              chatInfoOpen={chatInfoOpen}
              setChatInfoOpen={setChatInfoOpen}
              chat={chat || undefined}
              isLoading={isChatLoading}
              userId={userId!}
            />

            <div
              onScroll={handleScroll}
              ref={scrollContainerRef}
              className={cn(
                "flex-1 max-h-[calc(100vh-65px-70px)] overflow-y-auto w-full"
              )}
            >
              {isFetchingNextPage && (
                <Loader2 className="text-muted-foreground size-12 mx-auto animate-spin" />
              )}
              <div className="min-h-[calc(100vh-65px-70px)] flex flex-col p-4 gap-2 w-full">
                {!hasNextPage && (
                  <div
                    className={cn(allMessages?.length === 0 ? "flex-1" : "")}
                  >
                    <ChatProfileInfo
                      chat={chat || undefined}
                      otherParticipant={otherParticipant}
                    />
                  </div>
                )}

                {isMessagesLoading
                  ? Array.from({ length: 10 }).map((_, idx) => {
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex gap-2 w-[40%]",
                            idx & 1 && "self-end flex-row-reverse"
                          )}
                        >
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div
                            className={cn(
                              "flex flex-col gap-1 flex-1",
                              idx & 1 && "items-end"
                            )}
                          >
                            <Skeleton className="h-6 w-full rounded-full" />
                            <Skeleton className="h-4 w-1/2 rounded-full" />
                            <Skeleton className="h-4 w-24 rounded-full" />
                          </div>
                        </div>
                      );
                    })
                  : allMessages.map((item, idx) => {
                      if (Array.isArray(item)) {
                        return (
                          <MessageGroup
                            setReplyToMessage={(message) =>
                              setReplyMessage(message)
                            }
                            setEditingMessageId={setEditingMessageId}
                            setMessageValue={(val) => setMessage(val)}
                            key={`message-${idx}`}
                            messages={item}
                            chatType={chat?.type || "DM"}
                          />
                        );
                      }
                      if ("type" in item && item.type === "date") {
                        return (
                          <div key={`date-${idx}`} className="flex-none">
                            <DateSeparator date={item.date} />
                          </div>
                        );
                      }
                      return null;
                    })}
              </div>
            </div>

            <MessageInput
              replyMessage={replyMessage}
              setReplyToMessage={(message) => setReplyMessage(message)}
              editingMessageId={editingMessageId}
              setEditingMessageId={setEditingMessageId}
              message={message}
              setMessage={setMessage}
            />
          </>
        )}
      </div>
      {chatInfoOpen && chat && (
        <ChatActionSidebar
          closeActionSidebar={() => setChatInfoOpen(false)}
          chat={chat}
        />
      )}
    </div>
  );
};

export default ChatMessages;
