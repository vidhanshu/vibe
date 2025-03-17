"use client";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import CreateStatusModal from "@/src/common/components/modals/create-status-modal";
import useSessionStore from "@/src/common/stores/session-store";
import { NSPost } from "@/src/posts/types";
import { PlusIcon } from "lucide-react";

const StatusCircle = ({
  status,
  idx,
  selectStatus,
  onlyCreate = false,
}: {
  status?: NSPost.Status;
  idx: number;
  selectStatus: (id: number) => void;
  onlyCreate?: boolean;
}) => {
  const { user } = useSessionStore();

  if (!status && !onlyCreate) return null;

  const card = (
    <div>
      <div
        onClick={() => {
          selectStatus(idx);
        }}
        className={cn(
          status?.viewed ? "bg-secondary" : "insta-bg",
          "rounded-full p-0.5 cursor-pointer"
        )}
      >
        <UserAvatar
          className="size-16 border-[3px] border-black"
          username={status?.user.username}
          fallbackClassName="text-2xl"
          url={status?.user.profilePhoto?.url}
        />
      </div>
      <div className="text-muted-foreground text-sm text-center">
        {status?.user?.username}
      </div>
    </div>
  );
  const myCreateCard = (
    <CreateStatusModal asChild>
      <div className="relative">
        <div className={cn("rounded-full p-0.5 cursor-pointer")}>
          <UserAvatar
            className="size-16 border-[3px] border-black"
            fallbackClassName="text-2xl"
            username={user?.username}
            url={user?.profilePhoto?.url}
          />
        </div>
        <Button
          variant="secondary"
          size="icon-xs"
          endContent={<PlusIcon className="size-4" />}
          className="absolute bottom-4 right-0 size-6"
        />
        <div className="text-muted-foreground text-sm text-center">
          {user?.username}
        </div>
      </div>
    </CreateStatusModal>
  );
  if (onlyCreate) return myCreateCard;
  if (idx === 0 && status?.user.id !== user?.id) {
    return (
      <>
        {myCreateCard}
        {card}
      </>
    );
  }

  return card;
};

export default StatusCircle;
