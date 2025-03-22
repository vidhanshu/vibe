import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getChat, getChatMessages, sendMessage } from "../actions/chats-action";
import useInfinite from "@/src/common/hooks/use-infinite";
import { NSChat } from "../types";
import { useParams } from "next/navigation";
import useSessionStore from "@/src/common/stores/session-store";
import dayjs from "dayjs";

const useChatMessages = () => {
  const params = useParams();
  const userId = useSessionStore((s) => s.user?.id);
  const chatId = params.chatId as string;

  const [message, setMessage] = useState("");
  // const [mediaFile, setMediaFile] = useState<File | null>(null);

  const prevHeightRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialScrollDone = useRef(false);

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

  const otherParticipant = useMemo(
    () => chat?.participants?.find((p) => p.user.id !== userId),
    [chat, userId]
  );

  const allMessages = useMemo(() => {
    const allMessages = data
      ?.map((data) => data.items)
      .flat() as NSChat.Message[];
    if (!allMessages?.length) return [];

    // First, group messages by date
    const messagesByDate = new Map<string, NSChat.Message[]>();
    allMessages.forEach((message) => {
      const date = dayjs(message.createdAt).format("YYYY-MM-DD");
      if (!messagesByDate.has(date)) {
        messagesByDate.set(date, []);
      }
      messagesByDate.get(date)!.push(message);
    });

    // Convert to array and sort by date (newest first)
    const sortedDates = Array.from(messagesByDate.keys()).sort(
      (a, b) => dayjs(b).unix() - dayjs(a).unix()
    );

    const messageGroups: (NSChat.Message[] | { type: "date"; date: string })[] =
      [];

    sortedDates.forEach((date) => {
      const messages = messagesByDate.get(date)!;

      // Group messages by sender
      let currentGroup: NSChat.Message[] = [];
      messages.forEach((message, index) => {
        if (index === 0) {
          currentGroup = [message];
        } else if (message.senderId === messages[index - 1].senderId) {
          currentGroup.push(message);
        } else {
          if (currentGroup.length) {
            messageGroups.push([...currentGroup]);
          }
          currentGroup = [message];
        }
      });

      if (currentGroup.length) {
        messageGroups.push(currentGroup);
      }

      // Add date separator after the messages
      messageGroups.push({ type: "date", date });
    });

    return messageGroups;
  }, [data]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (isFetchingNextPage) {
      prevHeightRef.current = el.scrollHeight;
    }
  }, [isFetchingNextPage]);

  // To scroll to the extreme bottom on first load
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!initialScrollDone.current && data?.length && !isFetchingNextPage) {
      el.scrollTop = el.scrollHeight;
      initialScrollDone.current = true;
    }
  }, [data?.length, isFetchingNextPage]);

  // to preserver the scroll position upon next page fetches
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!isFetchingNextPage && prevHeightRef.current) {
      const newHeight = el.scrollHeight;
      const delta = newHeight - prevHeightRef.current;
      el.scrollTop += delta;
      prevHeightRef.current = 0;
    }
  }, [data?.length, isFetchingNextPage]);

  return {
    //chat
    chat,
    isChatLoading,
    // infinite messages
    allMessages,
    hasNextPage,
    isFetchingNextPage,
    infiniteRef: ref,
    isMessagesLoading: isLoading,
    // other participant of the chat
    otherParticipant,
    // to handle the scroll position upon infinite load
    scrollContainerRef,
    // message state
    message,
    setMessage,
    // mediaFile,
    // setMediaFile,
  };
};

export default useChatMessages;
