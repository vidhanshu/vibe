import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "@/src/common/stores/session-store";
import { NSChat } from "../types";
import { cn } from "@/lib/utils";
import { NSUser } from "@/src/users/types";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";

const GroupChip = ({
  title,
  lastMessage,
  participants,
  size = "sm",
  avatarOnly,
  messageSentAt,
  messageSender,
}: {
  title: string;
  lastMessage?: string;
  participants: NSChat.ChatMember[];
  avatarOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  messageSentAt?: Date;
  messageSender?: string;
}) => {
  const sm = size === "sm";
  const md = size === "md";
  const lg = size === "lg";
  const xl = size === "xl";
  const xl_2 = size === "2xl";
  const userId = useSessionStore((s) => s.user?.id);

  const participantsExceptMe = participants
    .filter((p) => p.userId !== userId)
    .slice(0, 3);

  return (
    <div className="flex gap-x-2 items-center">
      <div
        className={cn("relative", {
          "size-12": sm,
          "size-14": md,
          "size-16": lg,
          "size-18": xl,
          "size-20": xl_2,
        })}
      >
        <UserAvatar
          className={cn("absolute border border-secondary", {
            "size-8": sm,
            "size-10": md,
            "size-12": lg,
            "size-14": xl,
            "size-16": xl_2,
          })}
          fallbackClassName={cn({
            "text-base": sm,
            "text-xl": md,
            "text-3xl": lg,
            "text-4xl": xl,
            "text-5xl": xl_2,
          })}
          url={participantsExceptMe[0]?.user?.profilePhoto?.url}
          username={participantsExceptMe?.[0]?.user.username}
        />
        <UserAvatar
          className={cn("absolute bottom-0 right-0 border border-secondary", {
            "size-8": sm,
            "size-10": md,
            "size-12": lg,
            "size-14": xl,
            "size-16": xl_2,
          })}
          fallbackClassName={cn({
            "text-base": sm,
            "text-xl": md,
            "text-3xl": lg,
            "text-4xl": xl,
            "text-5xl": xl_2,
          })}
          url={participantsExceptMe?.[1]?.user.profilePhoto?.url}
          username={participantsExceptMe?.[1]?.user.username}
        />
      </div>
      {!avatarOnly && (
        <div>
          <p className={cn("font-bold text-left text-base")}>{title}</p>
          {lastMessage && (
            <div className="flex gap-x-2 items-center">
              <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                {messageSender && messageSender + ": "}
                {lastMessage}
              </p>
              {messageSentAt && (
                <span className="text-xs font-bold text-muted-foreground">
                  {" · "}
                  {getShortRelativeTime(messageSentAt)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupChip;
