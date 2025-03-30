"use client";

import { Separator } from "@/components/ui/separator";
import SuggestedForYou from "@/src/common/components/suggested";
import useInfinite from "@/src/common/hooks/use-infinite";
import useIsMobile from "@/src/common/hooks/use-is-mobile";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { CircleCheckBig, Loader, Plus } from "lucide-react";
import React, { Suspense, useMemo, useState } from "react";
import FeedListSkeleton from "./feed-list-skeleton";
import FeedPostCard from "./feed-post-card";
import FeedStatuses from "./status/feed-statuses";
import Button from "@/components/ui/button";
import dynamic from "next/dynamic";

const EditPostDrawer = dynamic(
  () => import("@/src/common/components/drawers/edit-post-drawer")
);
const FeedPostViewDrawer = dynamic(() => import("./feed-post-view-drawer"));
const CreatePostModal = dynamic(
  () =>
    import("@/src/common/components/modals/create-post-modal/create-post-modal")
);
const ViewPostModal = dynamic(
  () => import("@/src/common/components/modals/view-post-modal")
);

const FeedList = () => {
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [viewPostId, setViewPostId] = useState<string | null>(null);
  const { data, isFetchingNextPage, hasNextPage, isFetching, ref } =
    useInfinite({
      fetcher: getPosts,
      queryKey: ["posts"],
    });

  const paginatedResponse = useMemo(
    () => data?.map((data) => data.items).flat(),
    [data]
  );

  const postToEdit = useMemo(() => {
    if (!editPostId) return null;
    return paginatedResponse?.find((post) => post.id === editPostId);
  }, [editPostId, paginatedResponse]);

  const isMobile = useIsMobile();

  return (
    <>
      <div className="space-y-6">
        <FeedStatuses />
        {isFetching ? (
          <FeedListSkeleton />
        ) : paginatedResponse.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <NoContent
              iconClassName="size-8"
              iconContainerClassName="size-16"
              title="No posts"
              subtitle="Be the first one to post on vibe 😉!"
            >
              <CreatePostModal asChild>
                <Button
                  size="sm"
                  className="mt-2 w-fit"
                  containerProps={{ className: "gap-x-1" }}
                  endContent={<Plus className="size-5" />}
                >
                  Create post
                </Button>
              </CreatePostModal>
            </NoContent>
          </div>
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
                      <div className="border p-4 rounded-md mx-2 md:mx-0">
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

      {isMobile ? (
        <FeedPostViewDrawer
          postId={viewPostId}
          cancelView={() => setViewPostId(null)}
        />
      ) : (
        <Suspense>
          <ViewPostModal
            open={!!viewPostId}
            postId={viewPostId ?? ""}
            setOpen={() => setViewPostId(null)}
          />
        </Suspense>
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
