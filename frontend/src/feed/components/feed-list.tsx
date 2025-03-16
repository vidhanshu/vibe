"use client";

import { Separator } from "@/components/ui/separator";
import EditPostDrawer from "@/src/common/components/drawers/edit-post-drawer";
import SuggestedForYou from "@/src/common/components/suggested";
import useInfinite from "@/src/common/hooks/use-infinite";
import useIsMobile from "@/src/common/hooks/use-is-mobile";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { CircleCheckBig, Loader } from "lucide-react";
import React, { useMemo, useState } from "react";
import FeedListSkeleton from "./feed-list-skeleton";
import FeedPostCard from "./feed-post-card";
import FeedPostViewDrawer from "./feed-post-view-drawer";
import FeedStatuses from "./feed-statuses";

const FeedList = () => {
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [viewPostId, setViewPostId] = useState<string | null>(null);
  const { data, isFetchingNextPage, hasNextPage, isLoading, ref } = useInfinite(
    {
      fetcher: getPosts,
      queryKey: ["posts"],
    }
  );

  const paginatedResponse = data?.map((data) => data.items).flat();

  const postToEdit = useMemo(() => {
    if (!editPostId) return null;
    return paginatedResponse?.find((post) => post.id === editPostId);
  }, [editPostId]);

  const isMobile = useIsMobile();

  return (
    <>
      <div className="space-y-6">
        <FeedStatuses />
        {isLoading ? (
          <FeedListSkeleton />
        ) : (
          <div className="space-y-6 max-w-[29rem] mx-auto">
            {paginatedResponse?.map(
              (post: NSPost.DetailedPost, idx: number) => {
                if (paginatedResponse.length === 1 ? idx == 0 : idx === 1) {
                  return (
                    <React.Fragment key={post.id}>
                      <React.Fragment key={post.id}>
                        {idx > 0 && <Separator className="opacity-70" />}
                        <FeedPostCard
                          key={post.id}
                          detailedPost={post}
                          setEditPostId={setEditPostId}
                          setViewPostId={setViewPostId}
                        />
                      </React.Fragment>
                      <div className="border p-4 rounded-md">
                        <SuggestedForYou variant="feed" />
                      </div>
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={post.id}>
                    {idx > 0 && <Separator className="opacity-70" />}
                    <FeedPostCard
                      key={post.id}
                      detailedPost={post}
                      setEditPostId={setEditPostId}
                      setViewPostId={setViewPostId}
                    />
                  </React.Fragment>
                );
              }
            )}
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

      {isMobile && (
        <FeedPostViewDrawer
          postId={viewPostId}
          cancelView={() => setViewPostId(null)}
        />
      )}

      <EditPostDrawer
        cancelEdit={() => setEditPostId(null)}
        editPostId={editPostId}
        postToEdit={postToEdit}
      />
    </>
  );
};

export default FeedList;
