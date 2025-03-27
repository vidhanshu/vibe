import { cn } from "@/lib/utils";
import { NSChat } from "../types";
import Link from "next/link";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "@/src/common/stores/session-store";
import Message from "./message";

const MessageGroup = ({
  messages,
  setEditingMessageId,
  setMessageValue,
  setReplyToMessage,
  chatType,
}: {
  messages: NSChat.Message[];
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessageValue: (val: string) => void;
  setReplyToMessage: (val: NSChat.Message | null) => void;
  chatType: NSChat.ChatType;
}) => {
  const userId = useSessionStore((s) => s.user?.id);
  const sender = messages[0].sender;
  const isMyMessage = messages[0].senderId === userId;
  const total = messages.length;

  return (
    <div
      className={cn("flex gap-x-4", {
        "self-end flex-row-reverse  w-full": messages[0].senderId === userId,
      })}
    >
      {!messages[0].isLog && (
        <Link href={`/users/${sender.username}`} className="h-fit">
          <UserAvatar
            username={sender.username}
            url={sender.profilePhoto?.url}
          />
        </Link>
      )}
      <div className="flex flex-col-reverse gap-y-1 flex-1">
        {messages.map((message, idx) => (
          <Message
            setEditingMessageId={setEditingMessageId}
            setMessageValue={setMessageValue}
            setReplyToMessage={setReplyToMessage}
            key={`${message.id}-${idx}`}
            message={message}
            total={total}
            index={idx}
          />
        ))}
        {chatType === "GROUP" && !isMyMessage && !messages[0].isLog && (
          <span className="text-xs text-muted-foreground">
            {sender.name || sender.username}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageGroup;
