import { Skeleton } from "@/components/ui/skeleton";
import { NSChat } from "../types";
import UserChip from "@/src/common/components/user-chip";
import GroupChip from "./group-chip";
import Button from "@/components/ui/button";
import { Info } from "lucide-react";

const ChatHeader = ({
  chat,
  isLoading,
  userId,
  chatInfoOpen,
  setChatInfoOpen,
}: {
  chat: NSChat.Chat | undefined;
  isLoading: boolean;
  userId: string;
  chatInfoOpen: boolean;
  setChatInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const otherParticipant = chat?.participants.find((p) => p.user.id !== userId);
  const chatType = chat?.type;

  return (
    <div className="px-4 border-b h-[65px] flex justify-between items-center w-full">
      <div className="flex items-center">
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
          <div className="flex gap-x-2 items-center">
            <GroupChip
              title={chat?.name ?? "Unknown Group"}
              participants={chat?.participants ?? []}
            />
            <span className="text-muted-foreground text-sm font-semibold">
              ({chat?._count.participants} Members)
            </span>
          </div>
        )}
      </div>
      {chatType === "GROUP" && (
        <Button
          onClick={() => setChatInfoOpen((e) => !e)}
          variant={chatInfoOpen ? "default" : "secondary"}
          size="icon-xs"
          endContent={<Info className="size-4" />}
        />
      )}
    </div>
  );
};

export default ChatHeader;
