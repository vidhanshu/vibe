"use client";

import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmojiPicker from "@/src/common/components/popovers/emoji-picker";
import { useMutation } from "@tanstack/react-query";
import { Image, Smile } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { sendMessage } from "../actions/chats-action";
import { toast } from "sonner";

const MessageInput = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (value: string) => void;
}) => {
  const params = useParams();
  const chatId = params.chatId as string;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="px-4 py-2 w-full">
      <div className="flex items-center gap-x-2 border px-2 py-1.5 rounded-3xl w-full">
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
            onClick={() => mutate()}
            className="text-blue-500 font-bold text-sm"
          >
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

export default MessageInput;
