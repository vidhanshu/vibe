"use client";

import UserChip from "@/src/common/components/user-chip";
import useInfinite from "@/src/common/hooks/use-infinite";
import useSessionStore from "@/src/common/stores/session-store";
import { NSUser } from "@/src/users/types";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { getChats } from "../actions/chats-action";
import { NSChat } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import NoContent from "@/src/users/components/no-content";
import { Edit, Edit2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import GroupChip from "./group-chip";
import Button from "@/components/ui/button";
import ChatUsersModal from "./chat-users-modal";

const ChatList = () => {
  const { user } = useSessionStore();
  const { data, hasNextPage, isFetchingNextPage, isLoading, ref, status } =
    useInfinite({
      queryKey: ["chats"],
      fetcher: getChats,
    });

  const [personal, group] = useMemo(() => {
    const allChats = data?.map((data) => data.items as NSChat.Chat[]).flat();
    return [
      allChats.filter((chat) => chat.type === "DM"),
      allChats.filter((chat) => chat.type === "GROUP"),
    ];
  }, [data]);

  return (
    <div className="border-r flex flex-col">
      <Tabs defaultValue="personal" className="w-full py-0">
        <div className="border-b">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <UserChip user={user!} size="md" />
            <ChatUsersModal>
              <Button variant="secondary" size="icon-xs">
                <Edit className="size-4" />
              </Button>
            </ChatUsersModal>
          </div>
          <TabsList className="w-full bg-background h-fit p-0">
            <TabsTrigger
              value="personal"
              className="bg-background data-[state=active]:bg-background w-full data-[state=active]:border-b border-white rounded-none font-bold py-3"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="group"
              className="bg-background data-[state=active]:bg-background w-full data-[state=active]:border-b border-white rounded-none font-bold py-3"
            >
              Group
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 max-h-[calc(100vh-114px)] overflow-y-auto">
          <TabsContent className="m-0" value="personal">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : !personal.length ? (
              <div className="py-8 flex items-center justify-center">
                <NoContent
                  title="No Chats"
                  icon={MessageCircle}
                  iconClassName="size-4"
                  subtitle="There are no chats, select a user and chat"
                />
              </div>
            ) : (
              personal.map((chat) => {
                return <ChatListItem key={chat.id} chat={chat} />;
              })
            )}
          </TabsContent>
          <TabsContent className="m-0" value="group">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : !group.length ? (
              <div className="py-8 flex items-center justify-center">
                <NoContent
                  title="No Chats"
                  icon={MessageCircle}
                  iconClassName="size-4"
                  subtitle="There are no chats, select a user and chat"
                />
              </div>
            ) : (
              group.map((chat) => {
                return <ChatListItem key={chat.id} chat={chat} />;
              })
            )}
          </TabsContent>
          <div ref={ref} />
        </div>
      </Tabs>
    </div>
  );
};

const ChatListItem = ({ chat }: { chat: NSChat.Chat }) => {
  const param = useParams();
  const router = useRouter();
  const userId = useSessionStore((select) => select.user?.id);

  const chatMember: NSChat.ChatMember | undefined = chat.participants.find(
    (p) => p.user.id !== userId
  );

  const lastMessage = chat.messages?.[0];
  const messageText = lastMessage?.text || "No messages yet";
  const messageSender = lastMessage?.sender.username;

  return (
    <button
      onClick={() => router.push(`/chats/${chat.id}`)}
      className={cn(
        "px-4 py-3 hover:bg-secondary/40 transition-colors w-full",
        { "bg-secondary/40": param.chatId === chat.id }
      )}
    >
      {chat.type === "DM" ? (
        <UserChip
          noLink
          size="xl"
          variant="chat"
          message={messageText}
          user={chatMember?.user!}
          createdAt={lastMessage?.createdAt}
        />
      ) : (
        <GroupChip
          size="md"
          title={chat.name!}
          lastMessage={messageText}
          participants={chat.participants}
          messageSentAt={lastMessage.createdAt}
          messageSender={messageSender}
        />
      )}
    </button>
  );
};

export default ChatList;
