"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

const UserAvatar = ({
  className,
  username = "V",
  fallbackClassName,
  url,
  onClick,
}: {
  url?: string;
  username?: string;
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
}) => {
  return (
    <Avatar className={cn("size-6", className)} onClick={onClick}>
      <AvatarImage
        src={url}
        alt="@vibe"
        className="object-cover object-center"
      />
      <AvatarFallback className={cn("font-bold", fallbackClassName)}>
        {username?.[0].toUpperCase() ?? "V"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
