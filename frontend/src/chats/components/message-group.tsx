import { cn } from "@/lib/utils";
import { NSChat } from "../types";
import Link from "next/link";
import UserAvatar from "@/src/auth/components/user-avatar";
import dayjs from "dayjs";
import useSessionStore from "@/src/common/stores/session-store";
import Button from "@/components/ui/button";
import {
  Clipboard,
  MessageSquareOff,
  MoreVertical,
  Pencil,
  Play,
  Reply,
} from "lucide-react";
import ActionTooltip from "@/src/common/components/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unSendMessage } from "../actions/chats-action";
import { useParams } from "next/navigation";
import Image from "next/image";
import MediaViewerModal from "./media-viewer-modal";
import { useState } from "react";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";

const Message = ({
  message,
  total,
  index,
  setEditingMessageId,
  setMessageValue,
  setReplyToMessage,
}: {
  message: NSChat.Message;
  total: number;
  index: number;
  setMessageValue: (val: string) => void;
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  setReplyToMessage: (val: NSChat.Message | null) => void;
}) => {
  const qc = useQueryClient();
  const chatId = useParams().chatId as string;
  const userId = useSessionStore((s) => s.user?.id);
  const isMyMessage = message.senderId === userId;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyText] = useCopyToClipboard();
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);

  const { mutate: deleteMessage } = useMutation({
    mutationKey: ["message-delete", message.id],
    mutationFn: async () => {
      if (!chatId || !message.id) return;

      const res = await unSendMessage({ chatId, messageId: message.id });
      if (res.message) {
        throw new Error(res.message);
      }
      toast.success("Message unsent");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat", chatId] });
      qc.invalidateQueries({ queryKey: ["chat-messages", chatId] });
    },
  });

  const replyMessage = message.repliedToMessage;

  return (
    <div id={message.id} className="group">
      {message.isLog ? (
        <p className="text-center text-muted-foreground text-sm">
          {message.text}
        </p>
      ) : (
        <div
          className={cn(
            "w-fit relative max-w-[70%] space-y-1",
            isMyMessage && "ml-auto"
          )}
        >
          {/* replied to */}
          {!!replyMessage && (
            <a href={`#${replyMessage.id}`}>
              <>
                <div
                  className={cn(
                    "space-y-2 mt-4 mb-2",
                    isMyMessage ? "border-r-4 pr-2" : "border-l-4 pl-2"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs text-muted-foreground",
                      isMyMessage ? "text-right" : ""
                    )}
                  >
                    {isMyMessage
                      ? `You Replied to ${
                          replyMessage.senderId == userId
                            ? "Yourself"
                            : replyMessage.sender.name ||
                              replyMessage.sender.username
                        }`
                      : `${
                          message.sender.name || message.sender.username
                        } Replied to ${
                          replyMessage.senderId === message.senderId
                            ? "Themselves"
                            : replyMessage.senderId === userId
                            ? "You"
                            : replyMessage.sender.name ||
                              replyMessage.sender.username
                        }`}
                  </div>
                  {replyMessage?.media && (
                    <>
                      {replyMessage.media.mediaType === "IMAGE" ? (
                        <Image
                          src={replyMessage.media.url}
                          alt="media-file"
                          width={150}
                          height={150}
                          className={cn(
                            "rounded-md cursor-pointer",
                            isMyMessage && "ml-auto"
                          )}
                        />
                      ) : (
                        <div className="relative group/video cursor-pointer">
                          <video
                            className={cn(
                              "rounded-md max-w-[150px]",
                              isMyMessage && "ml-auto"
                            )}
                            src={replyMessage.media.url}
                          />
                          <Play className="size-8 group-hover/video:scale-125 transition-transform fill-white inset-0 m-auto absolute z-10" />
                        </div>
                      )}
                    </>
                  )}
                  <blockquote className="bg-secondary mr-auto px-4 py-1 rounded-3xl text-white/70">
                    {replyMessage.text?.slice(0, 60)}...
                  </blockquote>
                </div>
              </>
            </a>
          )}

          {/* text */}
          <div
            id={message.id}
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
          </div>

          {/* medias */}
          {message.media && (
            <div onClick={() => setIsMediaViewerOpen(true)}>
              {message.media.mediaType === "IMAGE" ? (
                <Image
                  src={message.media.url}
                  alt="media-file"
                  width={200}
                  height={200}
                  className="rounded-md cursor-pointer"
                />
              ) : (
                <div className="relative group/video cursor-pointer">
                  <video
                    className="rounded-md max-w-[200px]"
                    src={message.media.url}
                  />
                  <Play className="size-8 group-hover/video:scale-125 transition-transform fill-white inset-0 m-auto absolute z-10" />
                </div>
              )}
            </div>
          )}

          {/* actions */}
          <div
            className={cn(
              "text-[.6rem] absolute bottom-0 invisible md:invisible md:group-hover:visible flex gap-x-2 items-end",
              isMyMessage
                ? message.createdAt !== message.updatedAt
                  ? "-left-44"
                  : "-left-32"
                : message.createdAt !== message.updatedAt
                ? "-right-44"
                : "-right-32"
            )}
          >
            <DropdownMenu>
              <ActionTooltip content="More">
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon-xs"
                    variant="secondary"
                    endContent={<MoreVertical size={14} />}
                  />
                </DropdownMenuTrigger>
              </ActionTooltip>

              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {dayjs(message.createdAt).format("hh:mm a")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (message.text) copyText(message.text);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Clipboard /> Copy
                </DropdownMenuItem>
                {message.text && message.senderId === userId && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingMessageId(message.id);
                      setMessageValue(message.text ?? "");
                    }}
                  >
                    <Pencil /> Edit
                  </DropdownMenuItem>
                )}
                {isMyMessage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteMessage()}
                      className="text-rose-500"
                    >
                      <MessageSquareOff />
                      Unsend
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <ActionTooltip content="Reply">
              <Button
                onClick={() => setReplyToMessage(message)}
                size="icon-xs"
                variant="secondary"
                endContent={<Reply size={14} />}
              />
            </ActionTooltip>
            <span
              className={cn(
                "text-[.6rem] ",
                isMyMessage ? "text-right" : "text-left"
              )}
            >
              {dayjs(message.createdAt).format("hh:mm a")}
            </span>
            {message.createdAt !== message.updatedAt && (
              <span className="text-[.6rem]">
                (edited {getShortRelativeTime(message.updatedAt)})
              </span>
            )}
          </div>
        </div>
      )}

      <MediaViewerModal
        media={message.media}
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
      />
    </div>
  );
};

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
  const isMyMessage = sender.id === userId;
  const total = messages.length;

  return (
    <div
      className={cn("flex gap-x-4", {
        "self-end flex-row-reverse  w-full": sender.id === userId,
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
            key={message.id}
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
