import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import { NSUser } from "@/src/users/types";
import Link from "next/link";
import React from "react";

const UserChip = ({
  user,
  size = "sm",
  noLink = false,
  className,
  hideName = false,
}: {
  user: NSUser.User;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  noLink?: boolean;
  className?: string;
  hideName?: boolean;
}) => {
  const xs = size === "xs";
  const sm = size === "sm";
  const md = size === "md";
  const lg = size === "lg";
  const xl = size === "xl";
  const xl_2 = size === "2xl";

  const content = (
    <>
      <UserAvatar
        className={cn({
          "size-6": xs,
          "size-8": sm,
          "size-10": md,
          "size-12": lg,
          "size-14": xl,
          "size-16": xl_2,
        })}
        fallbackClassName={cn({
          "text-sm": xs,
          "text-base": sm,
          "text-xl": md,
          "text-2xl": lg,
          "text-3xl": xl,
          "text-4xl": xl_2,
        })}
        username={user?.username}
        url={user?.profilePhoto?.url}
      />
      <div>
        <p
          className={cn("font-bold text-lg", {
            "text-sm leading-tight": xs,
            "text-base": sm,
            "text-xl": md,
            "text-2xl": lg || xl,
            "text-3xl": xl_2,
          })}
        >
          {user?.username}
        </p>
        {!hideName && (
          <p
            className={cn("font-bold text-xs text-muted-foreground", {
              "text-[.6rem]": xs,
              "text-lg": xl_2,
            })}
          >
            {user?.name}
          </p>
        )}
      </div>
    </>
  );

  if (noLink) {
    return (
      <div className={cn("flex gap-x-2 items-center", className)}>
        {content}
      </div>
    );
  }
  return (
    <Link
      className={cn("flex gap-x-2 items-center", className)}
      href={`/users/${user?.username}`}
    >
      {content}
    </Link>
  );
};

export default UserChip;
