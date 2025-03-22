import Button from "@/components/ui/button";
import Link from "next/link";
import GroupChip from "./group-chip";
import UserAvatar from "@/src/auth/components/user-avatar";
import { NSChat } from "../types";

const ChatProfileInfo = ({
  chat,
  otherParticipant,
}: {
  chat: NSChat.Chat | undefined;
  otherParticipant: NSChat.ChatMember | undefined;
}) => {
  return (
    <div className="py-4 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        {chat?.type === "DM" ? (
          <UserAvatar
            className="size-24"
            fallbackClassName="text-5xl"
            username={otherParticipant?.user?.username}
            url={otherParticipant?.user.profilePhoto?.url}
          />
        ) : (
          <GroupChip
            participants={chat?.participants || []}
            title=""
            size="2xl"
          />
        )}
        <div>
          <p className="font-bold text-2xl text-center">
            {chat?.type === "DM"
              ? otherParticipant?.user?.username
              : chat?.name}
          </p>
          {otherParticipant?.user?.name && (
            <p className="text-sm text-muted-foreground text-center">
              {otherParticipant?.user?.name} . Vibe
            </p>
          )}
          {chat?.type === "GROUP" && chat?.description && (
            <p className="text-xs text-muted-foreground text-center">
              {chat?.description}
            </p>
          )}
        </div>
      </div>
      {chat?.type === "DM" && (
        <Link href={`/users/${otherParticipant?.user?.username}`}>
          <Button variant="secondary" size="sm" className="font-bold">
            View profile
          </Button>
        </Link>
      )}
    </div>
  );
};
export default ChatProfileInfo;
