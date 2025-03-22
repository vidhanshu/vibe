import { Skeleton } from "@/components/ui/skeleton";
import { NSChat } from "../types";
import UserChip from "@/src/common/components/user-chip";
import GroupChip from "./group-chip";

const ChatHeader = ({
  chat,
  isLoading,
  userId,
}: {
  chat: NSChat.Chat | undefined;
  isLoading: boolean;
  userId: string;
}) => {
  const otherParticipant = chat?.participants.find((p) => p.user.id !== userId);
  const chatType = chat?.type;

  return (
    <div className="px-4 border-b h-[65px] flex items-center w-full">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ) : chatType === "DM" ? (
        <UserChip user={otherParticipant?.user!} />
      ) : (
        <GroupChip
          title={chat?.name ?? "Unknown Group"}
          participants={chat?.participants ?? []}
        />
      )}
    </div>
  );
};

export default ChatHeader;
