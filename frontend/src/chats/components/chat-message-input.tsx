"use client";

import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmojiPicker from "@/src/common/components/popovers/emoji-picker";
import { useMutation } from "@tanstack/react-query";
import { Smile, Image, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sendMessage, updateMessage } from "../actions/chats-action";
import { toast } from "sonner";
import NImage from "next/image";
import { NSChat } from "../types";
import useSessionStore from "@/src/common/stores/session-store";
import useChatSocket, {
  SocketOnTypingResponse,
} from "../hooks/use-chat-socket";

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const MessageInput = ({
  message,
  setMessage,
  editingMessageId,
  setEditingMessageId,
  replyMessage,
  setReplyToMessage,
}: {
  message: string;
  setMessage: (value: string) => void;
  setEditingMessageId: (val: string | null) => void;
  editingMessageId: string | null;
  replyMessage: NSChat.Message | null;
  setReplyToMessage: (message: NSChat.Message | null) => void;
}) => {
  const userId = useSessionStore((s) => s.user?.id);
  const params = useParams();
  const chatId = params.chatId as string;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [typing, setTyping] = useState<Set<string>>();
  const userIdToNameMapRef = useRef<Map<string, string>>(new Map());
  const {
    startTyping,
    stopTyping,
    offStopTypingMessage,
    offTypingMessage,
    onStopTypingMessage,
    onTypingMessage,
  } = useChatSocket();

  const { isPending: isSendingMessage, mutate } = useMutation({
    mutationKey: ["send-message", chatId],
    mutationFn: async () => {
      if (!message.trim().length) return toast.error("Please enter message");
      const res = await sendMessage({
        chatId,
        message,
        media: mediaFile,
        repliedMessageId: replyMessage?.id,
      });
      if (res.message) {
        toast.error(res.message);
        return;
      }
      setMessage("");
      setMediaFile(null);
      setReplyToMessage(null);
      // sSendMessage(res.data); // moved to backend
      // scrollToBottom?.();
    },
  });

  const { isPending: isUpdatingMessage, mutate: update } = useMutation({
    mutationKey: ["update-message", editingMessageId],
    mutationFn: async () => {
      if (!editingMessageId) return;
      if (!message.trim().length) return toast.error("Please enter message");
      const res = await updateMessage({
        message,
        messageId: editingMessageId,
      });
      if (res.message || !res.data) {
        toast.error(res.message);
        return;
      }
      setMessage("");
      setEditingMessageId(null);
      // sUpdateMessage({ chatId: chatId, message: res.data }); // moved to backend
      toast.success("Message updated successfully");
      // scrollToBottom?.();
    },
  });

  // to autofocus
  useEffect(() => {
    textareaRef.current?.focus();
  }, [
    textareaRef,
    editingMessageId,
    replyMessage,
    isSendingMessage,
    isUpdatingMessage,
  ]);

  useEffect(() => {
    if (!chatId || !userId) return;

    const handleTyping = (payload: SocketOnTypingResponse) => {
      userIdToNameMapRef.current.set(payload.userId, payload.name);

      if (payload.chatId === chatId) {
        if (!typing?.has(payload.userId)) {
          setTyping((p) => {
            const newSet = new Set(p);
            newSet.add(payload.userId);
            return newSet;
          });
        }
      }
    };
    const handleStopTyping = (payload: SocketOnTypingResponse) => {
      if (payload.chatId === chatId) {
        setTyping((p) => {
          const newSet = new Set(p);
          newSet.delete(payload.userId);
          return newSet;
        });
      }
    };

    onTypingMessage(handleTyping);
    onStopTypingMessage(handleStopTyping);
    return () => {
      offTypingMessage(handleTyping);
      offStopTypingMessage(handleStopTyping);
    };
  }, [
    offStopTypingMessage,
    onStopTypingMessage,
    onTypingMessage,
    offTypingMessage,
    chatId,
    userId,
    typing,
  ]);

  useEffect(() => {
    if (!chatId || !message) return;

    startTyping({ chatId });

    const timer = setTimeout(() => {
      stopTyping({ chatId });
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopTyping({ chatId });
    };
  }, [message, chatId, startTyping, stopTyping]);

  const isLoading = isUpdatingMessage || isSendingMessage;
  const showPreview = editingMessageId || !!replyMessage;

  return (
    <div
      className={cn(
        "px-4 py-2 w-full",
        (editingMessageId || !!replyMessage || typing?.size) && "border-t"
      )}
    >
      {!!typing?.size && typing.size > 0 && (
        <div className="flex items-center text-xs text-muted-foreground pb-2">
          {Array.from(typing)
            .map((e) => userIdToNameMapRef.current.get(e))
            .join(", ")}{" "}
          Typing...
        </div>
      )}
      {showPreview && (
        <div
          className={cn(
            "flex justify-between mb-2",
            replyMessage?.media?.mediaType ? "items-start" : "items-center"
          )}
        >
          {!!replyMessage ? (
            <div>
              <p className="text-sm">
                Replying to{" "}
                <span className="font-bold">
                  {replyMessage.senderId === userId
                    ? "Yourself"
                    : replyMessage.sender.name || replyMessage.sender.username}
                </span>
              </p>
              {replyMessage.media &&
                (replyMessage.media.mediaType === "IMAGE" ? (
                  <NImage
                    src={replyMessage.media.url}
                    width={50}
                    height={50}
                    className="aspect-square rounded-md object-cover my-2"
                    alt="reply-image"
                  />
                ) : (
                  <div>video</div>
                ))}
              <p className="max-w-[200px] truncate text-muted-foreground text-sm">
                {replyMessage.text}
              </p>
            </div>
          ) : (
            <p className="text-sm">Editing Message</p>
          )}
          <Button
            onClick={() => {
              setEditingMessageId(null);
              setReplyToMessage(null);
            }}
            size="icon-xxs"
            variant="secondary"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <div className="border px-2 py-2 rounded-3xl w-full space-y-2">
        {mediaFile && (
          <div className="relative w-fit">
            {mediaFile.type.startsWith("image/") ? (
              <NImage
                width={100}
                height={100}
                alt="media-file"
                src={URL.createObjectURL(mediaFile)}
                className="rounded-2xl object-cover object-center aspect-square size-[100px]"
              />
            ) : (
              <div className="size-[100px] rounded-2xl bg-secondary flex items-center justify-center">
                <p className="text-center">
                  VIDEO
                  <br /> NO PREVIEW
                </p>
              </div>
            )}
            <Button
              size="icon-xxs"
              loading={isLoading}
              variant="secondary"
              loaderClassName="size-3"
              onClick={() => setMediaFile(null)}
              className="absolute -top-2 -right-2"
              endContent={<X className="size-3" />}
            />
          </div>
        )}
        <div className="flex items-center gap-x-2">
          <EmojiPicker
            onEmojiClick={(emoji: string) => setMessage(message + emoji)}
          >
            {({ open, setOpen }) => (
              <Button
                loading={isLoading}
                type="button"
                size="icon-sm"
                variant="secondary"
                className="min-w-9"
                loaderClassName="size-4"
                onClick={() => setOpen((p) => !p)}
              >
                <Smile className={cn("size-4", open && "text-blue-500")} />
              </Button>
            )}
          </EmojiPicker>
          <Textarea
            autoFocus
            disabled={isLoading}
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
                if (editingMessageId) {
                  update();
                } else {
                  mutate();
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
            <button
              onClick={() => (editingMessageId ? update() : mutate())}
              disabled={isLoading}
              className="text-blue-500 font-bold text-sm"
            >
              {editingMessageId ? "Update" : "Send"}
            </button>
          ) : (
            <div>
              <Button
                onClick={() => {
                  inputRef.current?.click();
                }}
                type="button"
                size="icon-sm"
                variant="secondary"
                className="min-w-9"
                loading={isLoading}
                loaderClassName="size-4"
              >
                {/* eslint-disable-next-line  jsx-a11y/alt-text */}
                <Image className="size-4" />
              </Button>
            </div>
          )}
          <input
            disabled={isLoading}
            type="file"
            accept=".jpg, .jpeg, .png, .webp, .gif, .bmp, .mp4, .avi, .mov, .wmv"
            ref={inputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.length ? e.target.files[0] : null;
              if (!file) return;
              if (file.size > MAX_FILE_SIZE) {
                return toast.error("Maximum file size is 5MB");
              }
              if (
                !file.type.startsWith("image") &&
                !file.type.startsWith("video")
              ) {
                return toast.error("File has to be either image or video");
              }
              setMediaFile(file);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
