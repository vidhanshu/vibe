"use client";

import Picker, { Theme } from "emoji-picker-react";
import React, { useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface EmojiPickerProps {
  onEmojiClick: (e: string) => void;
  children:
    | React.ReactNode
    | ((props: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      }) => React.ReactNode);
  // for the case where you want to control the open state
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const EmojiPicker = ({
  children,
  onEmojiClick,
  open: eOpen,
  setOpen: setEOpen,
}: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    setOpen(eOpen || false);
  }, [eOpen]);

  const ref = React.useRef<any>(null);

  useOnClickOutside(ref, () => {
    setOpen(false);
    setEOpen?.(false);
  });

  return (
    <div className="relative z-10">
      {typeof children === "function" ? children({ open, setOpen }) : children}
      <div ref={ref} className="absolute bottom-full left-full">
        <Picker
          theme={Theme.DARK}
          open={open}
          onEmojiClick={(e) => onEmojiClick(e.emoji)}
        />
      </div>
    </div>
  );
};

export default EmojiPicker;
