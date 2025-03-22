import { cn } from "@/lib/utils";
import { NSChat } from "../types";
import Link from "next/link";
import UserAvatar from "@/src/auth/components/user-avatar";
import dayjs from "dayjs";
import useSessionStore from "@/src/common/stores/session-store";

const Message = ({
  message,
  total,
  index,
}: {
  message: NSChat.Message;
  total: number;
  index: number;
}) => {
  const userId = useSessionStore((s) => s.user?.id);
  const isMyMessage = message.senderId === userId;

  return (
    <div
      id={message.id}
      className={cn(
        "px-3 py-1 bg-secondary w-fit rounded-sm relative group",
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
      <span
        className={cn(
          "text-[.6rem] absolute bottom-0 md:invisible md:group-hover:visible",
          isMyMessage ? "text-right -left-12" : "text-left -right-12"
        )}
      >
        {dayjs(message.createdAt).format("hh:mm a")}
      </span>
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
      <Link href={`/users/${sender.username}`} className="h-fit">
        <UserAvatar username={sender.username} url={sender.profilePhoto?.url} />
      </Link>
      <div className="flex flex-col-reverse gap-y-1">
        {messages.map((message, idx) => (
          <Message
            key={message.id}
            message={message}
            total={total}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageGroup;
