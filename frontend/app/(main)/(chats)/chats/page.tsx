import Button from "@/components/ui/button";
import { createChat } from "@/src/chats/actions/chats-action";
import ChatUsersModal from "@/src/chats/components/chat-users-modal";
import NoContent from "@/src/users/components/no-content";
import { MessageCircle } from "lucide-react";
import React from "react";

const Chats = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <NoContent
          icon={MessageCircle}
          iconClassName="size-12 stroke-1"
          iconContainerClassName="size-20"
          title="Your Messages"
          subtitle="Send private photos and messages to a friend or group."
        />
        <ChatUsersModal>
          <Button variant="info" className="w-fit font-bold" size="xs">
            Send message
          </Button>
        </ChatUsersModal>
      </div>
    </div>
  );
};

export default Chats;
