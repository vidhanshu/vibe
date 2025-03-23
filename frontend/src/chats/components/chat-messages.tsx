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
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
  const userId = useSessionStore((s) => s.user?.id);
  const {
    chat,
    allMessages,
    isChatLoading,
    scrollContainerRef,
    isFetchingNextPage,
    hasNextPage,
    otherParticipant,
    infiniteRef: ref,
    isMessagesLoading,
    message,
    setMessage,
    editingMessageId,
    setEditingMessageId,
    replyMessage,
    setReplyMessage,
  } = useChatMessages();

  return (
    <div
      className={cn(
        "h-screen flex flex-col",
        !chat && "items-center justify-center"
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
      ) : (
        <>
          <ChatHeader
            chat={chat || undefined}
            isLoading={isChatLoading}
            userId={userId!}
          />

          <div
            ref={scrollContainerRef}
            className={cn(
              "flex-1 max-h-[calc(100vh-65px-70px)] overflow-y-auto w-full scroll-smooth"
            )}
          >
            {isFetchingNextPage && (
              <Loader2 className="text-muted-foreground size-12 mx-auto animate-spin" />
            )}
            <div ref={ref} />
            <div className="min-h-[calc(100vh-65px-70px)] flex flex-col-reverse p-4 gap-2 w-full">
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
                          userId={userId!}
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
              {!hasNextPage && (
                <div className={cn(allMessages?.length === 0 ? "flex-1" : "")}>
                  <ChatProfileInfo
                    chat={chat || undefined}
                    otherParticipant={otherParticipant}
                  />
                </div>
              )}
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
  );
};

export default ChatMessages;
