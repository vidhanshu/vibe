"use client";

import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import EmojiPicker from "@/src/common/components/popovers/emoji-picker";
import { useMutation } from "@tanstack/react-query";
import { Smile, Image, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { sendMessage } from "../actions/chats-action";
import { toast } from "sonner";
import NImage from "next/image";

const MAX_FILE_SIZE = 6 * 1024 * 1024;
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
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { isPending: isSendingMessage, mutate } = useMutation({
    mutationKey: ["send-message", chatId],
    mutationFn: async () => {
      if (!message.trim().length) return toast.error("Please enter message");
      const res = await sendMessage({
        chatId,
        message,
        media: mediaFile,
      });
      if (res.message) return toast.error(res.message);
      setMessage("");
      setMediaFile(null);
    },
  });

  return (
    <div className="px-4 py-2 w-full">
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
              loading={isSendingMessage}
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
                loading={isSendingMessage}
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
            disabled={isSendingMessage}
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
              disabled={isSendingMessage}
              className="text-blue-500 font-bold text-sm"
            >
              Send
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
                loading={isSendingMessage}
                loaderClassName="size-4"
              >
                <Image className="size-4" />
              </Button>
            </div>
          )}
          <input
            disabled={isSendingMessage}
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
