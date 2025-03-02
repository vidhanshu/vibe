"use client";

import { Separator } from "@/components/ui/separator";
import useInfinite from "@/src/common/hooks/use-infinite";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import FeedListSkeleton from "./feed-list-skeleton";
import FeedPostCard from "./feed-post-card";
import FeedStatuses from "./feed-statuses";

const FeedList = () => {
  const { data, isFetchingNextPage, hasNextPage, isLoading, ref } = useInfinite(
    {
      fetcher: getPosts,
      queryKey: ["posts"],
    }
  );

  const paginatedResponse = data?.map((data) => data.items).flat();

  return (
    <div className="space-y-6">
      <FeedStatuses />
      {isLoading ? (
        <FeedListSkeleton />
      ) : (
        <div className="space-y-6 max-w-[29rem] mx-auto">
          {paginatedResponse?.map((post: NSPost.DetailedPost, idx: number) => {
            return (
              <React.Fragment key={post.id}>
                {idx > 0 && <Separator className="opacity-70" />}
                <FeedPostCard key={post.id} {...post} />
              </React.Fragment>
            );
          })}
          <div ref={ref} />
          {isFetchingNextPage && (
            <Loader className="mx-auto size-6 animate-spin" />
          )}
          {!hasNextPage && paginatedResponse?.length > 10 && (
            <NoContent
              size="sm"
              icon={CircleCheckBig}
              iconContainerClassName="border-none size-auto p-0"
              title="All caught up"
              subtitle="No more posts to show"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FeedList;
