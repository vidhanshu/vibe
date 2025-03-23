import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import { NSUser } from "@/src/users/types";
import Link, { LinkProps } from "next/link";
import React from "react";
import { getShortRelativeTime } from "../utils/dayjs";

const UserChip = ({
  user,
  message,
  className,
  size = "sm",
  noLink = false,
  avatarClassName,
  hideName = false,
  variant = "normal",
  avatarOnly = false,
  avatarFallbackClassName,
  createdAt,
  linkProps,
  endContent,
}: {
  user: NSUser.User;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "chat" | "normal";
  noLink?: boolean;
  className?: string;
  hideName?: boolean;
  avatarOnly?: boolean;
  message?: string;
  avatarClassName?: string;
  avatarFallbackClassName?: string;
  createdAt?: Date;
  linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  endContent?: React.ReactNode;
}) => {
  const xs = size === "xs";
  const sm = size === "sm";
  const md = size === "md";
  const lg = size === "lg";
  const xl = size === "xl";
  const xl_2 = size === "2xl";
  const isChatVariant = variant === "chat";

  const content = (
    <>
      <UserAvatar
        className={cn(
          {
            "size-6": xs,
            "size-8": sm,
            "size-10": md,
            "size-12": lg,
            "size-14": xl,
            "size-16": xl_2,
          },
          avatarClassName
        )}
        fallbackClassName={cn(
          {
            "text-sm": xs,
            "text-base": sm,
            "text-xl": md,
            "text-2xl": lg,
            "text-3xl": xl,
            "text-4xl": xl_2,
          },
          avatarFallbackClassName
        )}
        username={user?.username}
        url={user?.profilePhoto?.url}
      />
      {!avatarOnly && (
        <div>
          <p
            className={cn("font-bold text-lg text-left", {
              "text-sm leading-tight": xs,
              "text-xl": md,
              "text-3xl": xl_2,
              "text-2xl": lg || xl,
              "text-base": sm || isChatVariant,
              "font-normal": isChatVariant,
            })}
          >
            {user?.username}
          </p>
          {!hideName && !isChatVariant && (
            <p
              className={cn("font-bold text-xs text-muted-foreground", {
                "text-[.6rem]": xs,
                "text-lg": xl_2,
              })}
            >
              {user?.name}
            </p>
          )}
          {isChatVariant && (
            <div className="flex items-center gap-x-1 h-5">
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {message}
              </p>

              {createdAt && (
                <>
                  <span className="text-2xl">·</span>
                  <div className="font-bold text-muted-foreground text-xs">
                    {getShortRelativeTime(createdAt)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );

  if (noLink) {
    return (
      <div className="flex justify-between items-center">
        <div
          className={cn("flex gap-x-2 items-center w-fit flex-1", className)}
        >
          {content}
        </div>
        {endContent}
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center">
      <Link
        className={cn("flex gap-x-2 items-center w-fit flex-1", className)}
        href={`/users/${user?.username}`}
        {...linkProps}
      >
        {content}
      </Link>
      {endContent}
    </div>
  );
};

export default UserChip;
