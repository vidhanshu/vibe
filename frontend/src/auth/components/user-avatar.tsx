"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

const UserAvatar = ({
  className,
  username = "V",
  fallbackClassName,
  url,
}: {
  url?: string;
  username?: string;
  className?: string;
  fallbackClassName?: string;
}) => {
  return (
    <Avatar className={cn("size-6", className)}>
      <AvatarImage
        src={url}
        alt="@vibe"
        className="object-cover object-center"
      />
      <AvatarFallback className={fallbackClassName}>
        {username?.[0].toUpperCase() ?? "V"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
