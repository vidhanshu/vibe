"use client";

import UserAvatar from "@/src/auth/components/user-avatar";
import Link from "next/link";
import useSessionStore from "../stores/session-store";

const SuggestedForYou = () => {
  const { user } = useSessionStore();
  return (
    <div className="space-y-4 max-w-xs">
      <Link
        href={`/users/${user?.username}`}
        className="flex gap-x-2 items-center"
      >
        <UserAvatar username={user?.username} url={user?.profilePhoto?.url} />
        {user?.username}
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-muted-foreground">Suggested for you</h1>
        <button className="font-semibold text-sm">See All</button>
      </div>
    </div>
  );
};

export default SuggestedForYou;
