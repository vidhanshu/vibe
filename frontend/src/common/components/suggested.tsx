"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import { getFollowSuggestions } from "@/src/users/actions/user-actions";
import NoContent from "@/src/users/components/no-content";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";
import useSessionStore from "../stores/session-store";
import UserChip from "./user-chip";
import useFollow from "@/src/users/hooks/use-follow";

const SuggestedForYou = ({
  variant = "default",
}: {
  variant?: "feed" | "default";
}) => {
  const { user } = useSessionStore();

  const { handleFollowUnfollow, isPending } = useFollow({
    queryKesToInvalidate: [["follow-suggestions"], ["statuses"]],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["follow-suggestions"],
    queryFn: async () => {
      const res = await getFollowSuggestions({});
      return res.data;
    },
  });

  const isFeedVariant = variant === "feed";

  return (
    <div className={cn("space-y-4", isFeedVariant ? "" : "max-w-xs")}>
      {!isFeedVariant && <UserChip user={user!} size="md" />}
      <div className="flex justify-between items-center">
        <h1 className="text-muted-foreground font-bold">Suggested for you</h1>
        <button className="font-semibold text-sm">See All</button>
      </div>
      {isLoading ? (
        <div className="space-y-4 mt-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : data?.items?.length === 0 ? (
        <div className="pt-8">
          <NoContent
            size="sm"
            icon={User}
            title="No suggestions"
            subtitle="You don't have any suggestions"
          />
        </div>
      ) : (
        <div
          className={cn(
            isFeedVariant ? "flex gap-x-4 overflow-auto" : "space-y-4"
          )}
        >
          {data?.items?.map((item) => {
            return (
              <div
                key={item.id}
                className={cn(
                  "flex justify-between items-center",
                  isFeedVariant
                    ? "flex-col border px-4 py-2 rounded-md gap-4"
                    : ""
                )}
              >
                <Link
                  href={`/users/${item?.username}`}
                  className={cn(
                    "flex gap-2 items-center",
                    isFeedVariant ? "flex-col" : ""
                  )}
                >
                  <UserAvatar
                    className={cn(isFeedVariant ? "size-24" : "size-10")}
                    username={item?.username}
                    url={item?.profilePhoto?.url}
                    fallbackClassName={cn(
                      "font-bold",
                      isFeedVariant ? "text-4xl" : "text-2xl"
                    )}
                  />
                  <div
                    className={cn(
                      "flex flex-col",
                      isFeedVariant ? "text-center" : ""
                    )}
                  >
                    <span className="font-semibold">{item?.username}</span>
                    {isFeedVariant && (
                      <div className="text-xs text-muted-foreground truncate font-semibold">
                        {item?.name}
                      </div>
                    )}
                    <p className="text-muted-foreground text-xs truncate">
                      {item.followers?.[0]?.follower?.username
                        ? `Followed by ${item.followers[0].follower.username}`
                        : "Suggested for you"}
                    </p>
                  </div>
                </Link>
                <button
                  disabled={isPending}
                  onClick={async () =>
                    handleFollowUnfollow({
                      userId: item.id!,
                      username: item.username,
                    })
                  }
                  className={cn(
                    "font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                    isFeedVariant
                      ? "bg-blue-500 px-4 py-1 rounded-sm"
                      : "text-blue-500 "
                  )}
                >
                  Follow
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuggestedForYou;
