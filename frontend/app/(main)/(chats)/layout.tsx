import ChatList from "@/src/chats/components/chat-list";
import React, { PropsWithChildren } from "react";

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen grid grid-cols-[385px_1fr]">
      <ChatList />
      {children}
    </div>
  );
};

export default ChatLayout;
