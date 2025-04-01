"use client";

import { cn } from "@/lib/utils";
import Picker, { Theme } from "emoji-picker-react";
import React, { useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface EmojiPickerProps {
  onEmojiClick: (e: string) => void;
  position?: "top" | "bottom";
  children:
    | React.ReactNode
    | ((props: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      }) => React.ReactNode);
}
const EmojiPicker = ({
  children,
  onEmojiClick,
  position = "top",
}: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = React.useRef<any>(null);

  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  return (
    <div ref={ref} className="relative z-10 w-fit h-fit">
      {typeof children === "function" ? children({ open, setOpen }) : children}
      <div
        className={cn(
          "absolute left-full",
          position === "top" ? "bottom-full" : "top-full"
        )}
      >
        <Picker
          open={open}
          theme={Theme.DARK}
          onEmojiClick={(e) => onEmojiClick(e.emoji)}
        />
      </div>
    </div>
  );
};

export default EmojiPicker;
