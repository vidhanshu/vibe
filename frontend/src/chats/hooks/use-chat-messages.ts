import { useEffect, useMemo, useState } from "react";
import { getChatMessages } from "../actions/chats-action";
import useInfinite from "@/src/common/hooks/use-infinite";
import { NSChat } from "../types";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import useMessageContainerScroll from "./user-message-container-scroll";
import useSessionStore from "@/src/common/stores/session-store";
import useAudioUnlock from "@/src/common/hooks/use-audio-unlock";
import useChatSocket, {
  SocketOnRemoveMessagePayload,
  SocketOnUpdateMessagePayload,
} from "./use-chat-socket";

const useChatMessages = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const userId = useSessionStore((s) => s.user?.id);
  const {
    joinChat,
    leaveChat,
    onNewMessage,
    offNewMessage,
    onRemoveMessage,
    offRemoveMessage,
    onUpdateMessage,
    offUpdateMessage,
  } = useChatSocket();

  const [messages, setMessages] = useState<NSChat.Message[]>([]);

  const { audioRef, unlocked, content: audioContent } = useAudioUnlock();

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ref,
    fetchNextPage,
  } = useInfinite({
    manualFetchNext: true,
    queryKey: ["chat-messages", chatId],
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    fetcher: async (props: any) => getChatMessages({ chatId, ...props }),
  });

  const { prevScrollHeight, scrollContainerRef, handleScroll } =
    useMessageContainerScroll({
      isFetchingNextPage,
      messages,
    });

  useEffect(() => {
    if (data) {
      const allMessages = data
        .map((data) => data.items)
        .flat() as NSChat.Message[];
      setMessages(allMessages.reverse());
    }
  }, [data]);

  // Join chat room when component mounts
  useEffect(() => {
    if (chatId) {
      joinChat(chatId);
    }
    return () => {
      if (chatId) {
        leaveChat(chatId);
      }
    };
  }, [chatId, joinChat, leaveChat]);

  // Real-time message handler (already inside your socket effect)
  useEffect(() => {
    if (!userId) return;

    const handleNewMessage = (newMessage: NSChat.Message) => {
      if (newMessage.chatId === chatId) {
        if (unlocked && newMessage.chatId === chatId) {
          if (newMessage.senderId !== userId) {
            audioRef.current?.play();
          }
        }
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleRemoveMessage = ({
      chatId: mChatId,
      messageId,
    }: SocketOnRemoveMessagePayload) => {
      if (mChatId === chatId) {
        setMessages((prev) => prev.filter(({ id }) => id !== messageId));
      }
    };

    const handleUpdateMessage = ({
      chatId: mChatId,
      message,
    }: SocketOnUpdateMessagePayload) => {
      if (mChatId === chatId && message) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, ...message } : msg
          )
        );
      }
    };

    onNewMessage(handleNewMessage);
    onRemoveMessage(handleRemoveMessage);
    onUpdateMessage(handleUpdateMessage);
    return () => {
      offNewMessage(handleNewMessage);
      offRemoveMessage(handleRemoveMessage);
      offUpdateMessage(handleUpdateMessage);
    };
  }, [
    chatId,
    onNewMessage,
    offNewMessage,
    offRemoveMessage,
    onRemoveMessage,
    onUpdateMessage,
    offUpdateMessage,
    userId,
    unlocked,
  ]);

  const allMessages = useMemo(() => {
    if (!messages?.length) return [];

    // Group messages by date (messages are already sorted in desc)
    const messagesByDate = new Map<string, NSChat.Message[]>();
    messages.forEach((message) => {
      const date = dayjs(message.createdAt).format("YYYY-MM-DD");
      if (!messagesByDate.has(date)) {
        messagesByDate.set(date, []);
      }
      messagesByDate.get(date)!.push(message);
    });

    // Convert to array and sort by date (newest first)
    const sortedDates = Array.from(messagesByDate.keys()).sort(
      (a, b) => dayjs(a).unix() - dayjs(b).unix()
    );

    const messageGroups: (NSChat.Message[] | { type: "date"; date: string })[] =
      [];

    sortedDates.forEach((date) => {
      const messages = messagesByDate.get(date)!;

      // Add date separator after the messages
      messageGroups.push({ type: "date", date });

      // Group messages by sender
      let currentGroup: NSChat.Message[] = [];
      messages.forEach((message, index) => {
        if (message.isLog) {
          // If there's an existing group, add it to messageGroups
          if (currentGroup.length) {
            messageGroups.push([...currentGroup]);
            currentGroup = [];
          }
          // Add log message as a single message array
          messageGroups.push([message]);
        } else if (index === 0) {
          currentGroup = [message];
        } else if (
          message.senderId === messages[index - 1].senderId &&
          !messages[index - 1].isLog
        ) {
          currentGroup.push(message);
        } else {
          if (currentGroup.length) {
            messageGroups.push([...currentGroup]);
          }
          currentGroup = [message];
        }
      });

      if (currentGroup.length) {
        messageGroups.push([...currentGroup]);
      }
    });

    return messageGroups.map((gp) => {
      if (Array.isArray(gp)) {
        // sort messages in desc
        return gp.sort(
          (m1, m2) =>
            new Date(m2.createdAt).getTime() - new Date(m1.createdAt).getTime()
        );
      }
      return gp;
    });
  }, [messages]);

  return {
    allMessages,
    hasNextPage,
    isFetchingNextPage,
    infiniteRef: ref,
    isMessagesLoading: isLoading,
    fetchNextPage,
    scrollContainerRef,
    prevScrollHeight,
    audioRef,
    handleScroll,
    audioContent,
  };
};

export default useChatMessages;
