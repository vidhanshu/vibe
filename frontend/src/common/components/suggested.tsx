"use client";

import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/src/auth/components/user-avatar";
import { followUnfollow } from "@/src/users/actions/follow-actions";
import { getFollowSuggestions } from "@/src/users/actions/user-actions";
import NoContent from "@/src/users/components/no-content";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSessionStore from "../stores/session-store";

const SuggestedForYou = () => {
  const qc = useQueryClient();
  const { user } = useSessionStore();

  const { mutate: handleFollowUnfollow, isPending } = useMutation({
    mutationKey: ["follows"],
    mutationFn: async (userId: string) => {
      const res = await followUnfollow(userId);
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success("Successfully followed");
        qc.invalidateQueries({ queryKey: ["follow-suggestions"] });
      }
      return res.data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["follow-suggestions"],
    queryFn: async () => {
      const res = await getFollowSuggestions({});
      return res.data;
    },
  });

  return (
    <div className="space-y-4 max-w-xs">
      <Link
        href={`/users/${user?.username}`}
        className="flex gap-x-2 items-center"
      >
        <UserAvatar className="size-10" username={user?.username} url={user?.profilePhoto?.url} />
        <span className="font-bold text-lg">{user?.username}</span>
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-muted-foreground">Suggested for you</h1>
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
        data?.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <Link
              href={`/users/${item?.username}`}
              className="flex gap-x-2 items-center"
            >
              <UserAvatar
                className="size-10"
                username={item?.username}
                url={item?.profilePhoto?.url}
                fallbackClassName="font-bold text-2xl"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{item?.username}</span>
                <span className="text-muted-foreground text-xs">
                  {item.followers?.[0]?.follower?.username
                    ? `Followed by ${item.followers[0].follower.username}`
                    : "Suggested for you"}
                </span>
              </div>
            </Link>
            <button
              disabled={isPending}
              onClick={async () => handleFollowUnfollow(item.id)}
              className="font-semibold text-sm text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SuggestedForYou;
